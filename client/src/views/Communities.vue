<template>
    <div>
    <v-container
    class="grey lighten-5"
    >
    <v-layout row wrap>
        <v-flex
          v-for="entry in cardEntries"
          :key="entry.title"
        >
        <v-card
        class="mx-auto"
        tile
        max-width="320"
        style="margin-bottom: 1rem; margin-top: 1rem; padding:0.5rem"
        >
        <v-img
        :lazy-src="entry.logo ? entry.logo : defaultLogo"
        :src="entry.logo ? entry.logo : defaultLogo"
        height="200px"
        elevation="2"
        contain
        position="center center"
        ></v-img>

        <v-card-title>
        {{entry.title}}
        </v-card-title>

        <v-card-subtitle>
        {{entry.description}}
        </v-card-subtitle>

        <v-card-actions>
        <v-btn
            color="blue darken-2"
            text
            :href="entry.link"
        >
            Visit
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            v-if="entry.expand"
            icon
            @click="entry.expand.show = !entry.expand.show"
        >
            <v-icon>{{ entry.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        </v-card-actions>

        <v-expand-transition> 
        <div v-show="entry.expand.show">
            <v-divider></v-divider>
            <v-card-text>
            {{entry.expand.description}}
            <v-list 
                v:if="entry.expand.plugs"
                rounded
            >
            <v-list-item-group
                color="primary"
            >
                <v-list-item
                v-for="(item) in entry.expand.plugs"
                :key="item.name"
                >
                <v-list-item-icon>
                    <v-icon>mdi-{{item.type}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <a v-bind:href="item.value"><v-list-item-title v-text="item.name"></v-list-item-title></a>
                </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
            </v-list>
            </v-card-text>
        </div>
        </v-expand-transition>
    </v-card>
    </v-flex>
    </v-layout>
    </v-container>
    </div>
</template>

<script>
export default ({
    name: "communities",
    data() {
        return {
            defaultLogo: require('@/assets/default-card-et.png'),
            cardEntries:[
                { 
                    title: 'ETJump',
                    logo: 'https://etjump.com/images/etjump-logo.svg',
                    description: 'Modification for Wolfenstein: Enemy Territory.',
                    link: 'https://etjump.com',
                    expand: {
                        show: false,
                        description: 'Actively developed by:',
                        plugs: [
                            { name: 'Aciz', value: 'https://github.com/Aciz', type: 'github'},
                            { name: 'Ryven', value: 'https://github.com/isRyven', type: 'github'},
                            { name: 'Zero', value: 'https://github.com/haapanen', type: 'github'}
                        ]
                    }
                },
                {
                    title: 'Trackbase',
                    logo: 'https://pbs.twimg.com/profile_images/1166309426594291712/Pa77tAu8_400x400.jpg',
                    description: 'Server tracker for Wolfenstein: Enemy Territory.',
                    link: 'https://et.trackbase.net',
                    expand: false
                },
                {
                    title: 'NetRadiant',
                    description: 'Free brush-based 3D game level editor. Commonly used by ETJump mappers.',
                    link: 'https://et.splatterladder.com',
                    logo: 'https://netradiant.gitlab.io/img/avatar-icon.png',
                    expand: {
                        show: false,
                        description: "Being actively developed:",
                        plugs: [
                            { name: 'NetRadiant', value: 'https://gitlab.com/xonotic/netradiant', type:'gitlab' }
                        ]
                    }
                }
            ]
        };
    }
})
</script>