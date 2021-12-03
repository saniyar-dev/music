<template>
<main>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none" @click.prevent="newSong(song)">
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.commentCount }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <vee-form :validation-schema="schema"
        @submit="submitComment" v-if="loggedIn">
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></vee-field>
          <ErrorMessage name="comment" class="text-red-600 mb-4 block" />
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
          :disabled="commentInSubmition">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="0">Latest</option>
          <option value="1">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto pb-24">
    <li class="p-6 bg-gray-50 border border-gray-200"
    v-for="comment in sortedComments" :key="comment.docId">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.date }}</time>
      </div>

      <p>{{ comment.content }}</p>
    </li>
  </ul>

  <alert-message-component key="1000"
  :color="alertVariant" :message="alertMessage" v-if="alertShow"/>
</main>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  songsCollection, doc, getDoc, auth, commentsCollection, addDoc,
  query, getDocs, where, updateDoc,
} from '../includes/firebase';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      alertShow: false,
      alertMessage: '',
      alertVariant: '',
      commentInSubmition: false,
      comments: [],
      sort: '0',
    };
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
  computed: {
    ...mapState(['loggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '0') {
          return new Date(b.date) - new Date(a.date);
        }

        return new Date(a.date) - new Date(b.date);
      });
    },
  },
  async created() {
    const docSnapshot = await getDoc(doc(songsCollection, this.$route.params.id));

    if (!docSnapshot.exists()) {
      this.$router.push({ name: 'Home' });
      return;
    }

    const { sort } = this.$route.query;

    this.sort = sort === '0' || sort === '1' ? sort : '0';

    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    ...mapActions(['newSong']),
    async submitComment(values) {
      // submit to firebase
      this.commentInSubmition = true;
      this.alertMessage = 'submition is in progress';
      this.alertVariant = 'bg-blue-600';
      this.alertShow = true;

      try {
        const comment = {
          content: values.comment,
          date: new Date().toString(),
          sid: this.$route.params.id,
          name: auth().currentUser.displayName ? auth().currentUser.displayName : 'Unknown',
          uid: auth().currentUser.uid,
        };
        await addDoc(commentsCollection, comment);

        this.song.commentCount += 1;

        await updateDoc(doc(songsCollection, this.$route.params.id), {
          commentCount: this.song.commentCount,
        });
      } catch (error) {
        console.log(error);
        this.alertMessage = 'something went wrong';
        this.alertVariant = 'bg-red-600';

        setTimeout(() => {
          this.alertMessage = '';
          this.alertVariant = '';
          this.commentInSubmition = false;
          this.alertShow = false;
        }, 3000);
        document.querySelector('textarea').value = '';

        return;
      }

      document.querySelector('textarea').value = '';
      this.alertMessage = "Success! you're comment has been submited!";
      this.alertVariant = 'bg-green-600';
      this.getComments();
      setTimeout(() => {
        this.alertMessage = '';
        this.alertVariant = '';
        this.commentInSubmition = false;
        this.alertShow = false;
      }, 3000);
    },
    async getComments() {
      try {
        const q = query(commentsCollection, where('sid', '==', this.$route.params.id));
        const snapshots = await getDocs(q);

        this.comments = [];

        snapshots.forEach((commentSnapshot) => {
          this.comments.push({
            ...commentSnapshot.data(),
            docId: commentSnapshot.id,
          });
        });
      } catch (error) {
        console.log(error);
        this.alertMessage = 'something went wrong';
        this.alertVariant = 'bg-red-600';

        setTimeout(() => {
          this.alertMessage = '';
          this.alertVariant = '';
          this.commentInSubmition = false;
          this.alertShow = false;
        }, 3000);
      }
    },
  },
};
</script>
