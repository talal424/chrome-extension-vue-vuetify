<template>
  <v-app>
    <v-app-bar color="primary" app dense dark>
      <v-toolbar-title>Popup Page</v-toolbar-title>
      <v-spacer />

      <NightMode />
    </v-app-bar>
    <v-main>
      <v-card class="mx-auto" max-width="840" min-width="600" flat>
        <v-list subheader three-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Page Scraper</v-list-item-title>
              <v-list-item-subtitle>
                Scrape page content and export as excel files.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list flat subheader :three-line="false">
          <v-subheader>Content Parser</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="d-flex justify-space-between">
                Scrape Shopee Mall
                <span>
                  <v-chip
                    v-if="!shopeeMallQueryParams"
                    x-small
                    class="text-body-2 white--text"
                    color="red"
                  >
                    not a shopee page
                  </v-chip>
                  <v-btn
                    icon
                    :loading="loading"
                    :disabled="!shopeeMallQueryParams"
                    @click="getShopTabXHR()"
                  >
                    <v-icon>{{ $mdi.mdiSpider }}</v-icon>
                  </v-btn>
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-textarea
                  v-model="pageSource"
                  style="font-family: monospace"
                ></v-textarea>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import NightMode from '#/NightMode'
import { CONTENT_ACTIONS, SHOPEE_CONFIG } from '../constants'
const browser = require('webextension-polyfill')

export default {
  components: {
    NightMode
  },
  data() {
    return {
      settings: [],
      pageSource: '',
      activeTab: null,
      queryTabInterval: null,
      loading: true,
      recievedMsg: null,
      name: 'popup',
      port: null
    }
  },
  computed: {
    shopeeMallQueryParams() {
      if (!this.loading && this.activeTab) {
        const urlMatch = this.activeTab.url?.match(SHOPEE_CONFIG.MALL_URL_REGEX)
        if (urlMatch && urlMatch[1]) {
          return { username: urlMatch[1] }
        }
      }
      return null
    }
  },
  watch: {
    activeTab(tab) {
      if (tab && tab?.status === 'complete') {
        clearInterval(this.queryTabInterval)
        this.loading = false
        this.port = chrome.tabs.connect(this.activeTab?.id, {
          name: this.name
        })
        this.port.onMessage.addListener(this.onPortMessage)
      }
    }
  },
  async mounted() {
    this.queryTabInterval = setInterval(async () => {
      await browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          this.activeTab = tabs[0] || null
          this.pageSource = JSON.stringify(this.activeTab, null, 2)
        })
    }, 100)
  },
  methods: {
    onPortMessage(msg) {
      this.pageSource = JSON.stringify(msg, null, 2)
    },
    async getShopTabXHR() {
      try {
        await this.port.postMessage({
          action: CONTENT_ACTIONS.SHOPEE_GET_SHOP_TAB,
          params: this.shopeeMallQueryParams
        })
      } catch {
        this.pageSource = JSON.stringify(browser.runtime.lastError, null, 2)
      }
    },
    async getPageSource() {
      if (this.activeTab) {
        try {
          await this.port.postMessage({
            action: CONTENT_ACTIONS.SCAN_TILL_END_GET_BODY
          })
        } catch {
          this.pageSource = JSON.stringify(browser.runtime.lastError, null, 2)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/options.scss';
</style>
