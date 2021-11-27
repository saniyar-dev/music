<template>
  <section class="container mx-auto mt-6 mb-24">
    <div class="md:grid md:grid-cols-3 md:gap-4">

      <div class="col-span-1">
        <!-- upload component -->
        <app-upload ref="upload" @listUserSongs="listUserSongs()"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <song-in-manage-panel v-for="song in songs" :key="song.docId" :song="song"
            @listUserSongs="listUserSongs()"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import AppUpload from '../components/Upload.vue';
import SongInManagePanel from '../components/SongInManagePanel.vue';
import {
  songsCollection, auth, where, query, getDocs,
} from '../includes/firebase';

export default {
  name: 'Manage',
  components: {
    AppUpload,
    SongInManagePanel,
  },
  data() {
    return {
      songs: [],
      unsavedEdit: false,
      uploadInProgress: false,
    };
  },
  methods: {
    async listUserSongs() {
      this.songs = [];
      const q = query(songsCollection, where('uid', '==', auth().currentUser.uid));

      const filteredSongs = await getDocs(q);

      filteredSongs.forEach((document) => {
        const song = {
          ...document.data(),
          docId: document.id,
        };

        this.songs.push(song);
      });
    },
  },
  async created() {
    await this.listUserSongs();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  //  beforeRouteEnter(to, from, next) {
  //    if (store.state.loggedIn) {
  //      next();
  //    } else {
  //      next({ name: 'Home' });
  //    }
  //  },
};
</script>
