<template>
  <v-app>
    <v-app-bar color="primary" app dense dark>
      <v-toolbar-title>Popup Page</v-toolbar-title>
      <v-spacer />

      <NightMode />
    </v-app-bar>
    <v-main>
      <v-card class="mx-auto" max-width="720" min-width="360" flat>
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
                Scrape
                <v-btn icon @click="getPageSource()">
                  <v-icon>{{ $mdi.mdiSpider }}</v-icon>
                </v-btn>
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
      queryTabInterval: null
    }
  },
  watch: {
    activeTab(tab) {
      if (tab) clearInterval(this.queryTabInterval)
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
    }, 10)
  },
  methods: {
    async messageTab(tabId, msg) {
      if (tabId) return browser.tabs.sendMessage(tabId, { msg })
    },
    async getPageSource() {
      if (this.activeTab) {
        const bodyHtml = await this.messageTab(this.activeTab?.id, {
          action: 'scrape_body'
        })
        this.pageSource = bodyHtml
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/options.scss';
</style>
