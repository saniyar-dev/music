<template>
<alert-message-component :color="messageVariant" :message="message" v-if="messageShow" />
<div class="border border-gray-200 p-3 mb-4 rounded">
  <div>
    <h4 class="inline-block text-2xl font-bold">
      {{ song.modifiedName }}
      <span class="text-sm ml-1 text-gray-500 font-medium">{{ song.genre }}</span>
    </h4>
    <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
    @click.prevent="deleteSong">
      <i class="fa fa-times"></i>
    </button>
    <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
    @click.prevent="editFormShow = !editFormShow">
      <i class="fa fa-pencil-alt"></i>
    </button>
  </div>

  <div v-show="editFormShow">
    <vee-form @submit="submitChanges" :validation-schema="schema">
      <div class="mb-3">
        <label class="inline-block mb-2">Song Title</label>
        <vee-field type="text" name="modifiedName"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
            transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Song Title" />
        <ErrorMessage class="text-red-600" name="modifiedName" />
      </div>
      <div class="mb-3">
        <label class="inline-block mb-2">Genre</label>
        <vee-field type="text" name="genre"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
            transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Genre" />
        <ErrorMessage class="text-red-600" name="genre" />
      </div>
      <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
        Submit
      </button>
      <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600 ml-2"
      @click.prevent="editFormShow = !editFormShow">
        Go Back
      </button>
    </vee-form>
  </div>
</div>
</template>

<script>
import {
  updateDoc, songsCollection, doc, deleteDoc, deleteObject, ref, storage,
} from '../includes/firebase';

export default {
  name: 'songInManagePanel',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  emits: ['listUserSongs'],
  data() {
    return {
      schema: {
        modifiedName: 'required|max:20|min:3',
        genre: 'required',
      },
      editFormShow: false,
      message: 'please wait! while we progress!',
      messageVariant: 'bg-blue-500',
      messageShow: false,
    };
  },
  methods: {
    async deleteSong() {
      const { docId, url } = this.song;
      this.messageShow = true;
      this.message = 'please wait, while we progress!';
      this.messageVariant = 'bg-blue-500';

      try {
        await deleteObject(ref(storage, url));
        await deleteDoc(doc(songsCollection, docId));
      } catch (error) {
        this.message = 'Something went wrong please try again later!';
        this.messageVariant = 'bg-red-500';

        setTimeout(() => {
          this.messageShow = false;
        }, 3000);
        return;
      }

      this.message = 'success! song information has been changed!';
      this.messageVariant = 'bg-green-500';

      setTimeout(() => {
        this.messageShow = false;
        this.$emit('listUserSongs');
      }, 3000);
    },
    async submitChanges(values) {
      const { docId } = this.song;
      this.messageShow = true;
      this.message = 'please wait, while we progress!';
      this.messageVariant = 'bg-blue-500';

      try {
        await updateDoc(doc(songsCollection, docId), values);
      } catch (error) {
        this.message = 'Something went wrong please try again later!';
        this.messageVariant = 'bg-red-500';

        setTimeout(() => {
          this.messageShow = false;
        }, 3000);
        return;
      }

      this.message = 'success! song information has been changed!';
      this.messageVariant = 'bg-green-500';

      setTimeout(() => {
        this.messageShow = false;
        this.$emit('listUserSongs');
      }, 3000);
    },
  },
};
</script>
