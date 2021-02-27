<template>
  <v-app>
    <v-app-bar color="primary" app dense dark>
      <v-app-bar-nav-icon />

      <v-toolbar-title>Popup Page</v-toolbar-title>
      <v-spacer />

      <NightMode />
    </v-app-bar>
    <v-main>
      <v-card class="mx-auto" max-width="400" flat>
        <v-list subheader three-line>
          <v-subheader>User Controls</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Content filtering</v-list-item-title>
              <v-list-item-subtitle>
                Set the content filtering level to restrict appts that can be
                downloaded
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list flat subheader three-line>
          <v-subheader>General</v-subheader>

          <v-list-item-group v-model="settings" multiple active-class="">
            <v-list-item>
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" />
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>Notifications</v-list-item-title>
                  <v-list-item-subtitle>
                    Notify me about updates to apps or games that I
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>

            <v-list-item>
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" />
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>Sound</v-list-item-title>
                  <v-list-item-subtitle>
                    Auto-update apps at any time. Data charges may
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>

            <v-list-item>
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" />
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>Auto-add widgets</v-list-item-title>
                  <v-list-item-subtitle>
                    Automatically add home screen widgets when downloads
                    complete
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import NightMode from '#/NightMode'

export default {
  components: {
    NightMode
  },
  data() {
    return {
      settings: []
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/popup.scss';
</style>
