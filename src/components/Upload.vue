<template>
<div class="bg-white rounded border border-gray-200 relative flex flex-col">
  <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
    <span class="card-title">Upload</span>
    <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
  </div>
  <div class="p-6">
    <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid text-white': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="upload($event)">
        <h5>Drop your files here</h5>
      </div>
      <div class="m-0 p-2">
        or
      </div>
      <input type="file" multiple @change="upload($event)" class="m-0">
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
         <i :class="upload.icon"></i> {{upload.name}}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="progress-bar transition-all"
          :class="upload.variant"
          :style="{ width: upload.currentProgress + '%'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  storage, ref, uploadToFirebase, auth, getDownloadURL, songsCollection, addDoc,
} from '../includes/firebase';

export default {
  name: 'AppUpload',
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  emits: ['listUserSongs'],
  methods: {
    upload($event) {
      this.isDragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          console.log('succes');
          return;
        }

        const metadata = {
          contentType: 'audio/mpeg',
        };

        const songRef = ref(storage, `songs/${file.name}`);
        const task = uploadToFirebase(songRef, file, metadata);

        const uploadIndex = this.uploads.push({
          task,
          currentProgress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          textClass: '',
        }) - 1;

        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].currentProgress = progress;
        }, (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].textClass = 'text-red-400';

          console.log(error);
        }, async () => {
          const song = {
            uid: auth().currentUser.uid,
            displayName: auth().currentUser.displayName,
            originalName: task.snapshot.ref.name,
            modifiedName: task.snapshot.ref.name,
            genre: '',
            commentCount: 0,
          };

          song.url = await getDownloadURL(task.snapshot.ref);
          await addDoc(songsCollection, song);

          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].textClass = 'text-green-400';
          setTimeout(() => {
            this.uploads.splice(uploadIndex, 1);
          }, 2000);

          this.$emit('listUserSongs');
        });
      });
    },
    //    cancelUploads() {
    //      this.uploads.forEach((upload) => {
    //        upload.task.cancel();
    //      });
    //    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
