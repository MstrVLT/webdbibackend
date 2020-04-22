<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <nav class="panel is-link">
          <!--      <p class="panel-heading ">-->
          <!--        DBI Backend-->
          <!--      </p>-->
          <div class="panel-block" v-if="!serverStarted">
            <input
              type="file"
              ref="file"
              style="display: none"
              @change="handleFileChange"
              accept=".nsz,.nsp,.xci"
              multiple
            />
            <button
              :disabled="serverStarted"

              :class="[{ 'is-outlined': files.length > 0 }, 'button is-link is-fullwidth']"

              @click="$refs.file.click()"
            >
              1. Add file ...
            </button>
          </div>
          <div v-if="files.length > 0">
            <div
              class="panel-block"
              v-for="(file, index) in files"
              :key="file.name"
            >
              <div class="container">
                <div class="bg" style="width: 0%"></div>
                <article class="message is-white">
                  <div class="message-header">
                    {{ file.name + " (" + returnFileSize(file.size) + ")" }}
                    <button
                      v-if="!serverStarted"
                      @click="removeFile(index)"
                      class="delete is-right"
                    ></button>
                  </div>
                </article>
              </div>
            </div>

            <div class="panel-block" v-if="!serverStarted">
              <button
                class="button is-link is-fullwidth"
                @click="serverStarted = true"
              >
                2. Start server
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </section>
</template>

<script>
// import { dbi } from './../dbi.js';

export default {
  name: "Home",
  data: function() {
    return {
      files: [],
      serverStarted: false
    };
  },
  methods: {
    returnFileSize(number) {
      if (number < 1024) {
        return number + " bytes";
      } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + " KB";
      } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + " MB";
      }
    },
    handleFileChange(e) {
      console.log(e.target.files.length);
      e.target.files.forEach(fileNew => {
        console.log(fileNew);
        let result = this.files.find(file => {
          return fileNew.name === file.name;
        });
        if (this.files.length === 0 || !result) {
          this.files.push(fileNew);
        }
      });
    },
    removeFile(index) {
      // console.log(JSON.stringify(e.target))
      if (index > -1) {
        this.files.splice(index, 1);
      }
    }
  },
  // watch: {
  //   serverStarted: function (val) {
  //     if (val) {
  //
  //     }
  //   },
  // },
  created() {}
};
</script>

<style>
.message-header {
  font-weight: 400 !important;
}

.delete,
.modal-close {
  background-color: #ffffff;
}

.delete:hover,
.modal-close:hover,
.delete:focus,
.modal-close:focus {
  background-color: #ffffff;
}

.delete:active,
.modal-close:active {
  background-color: #ffffff;
}

.delete::before,
.modal-close::before {
  background-color: rgba(255, 0, 0, 0.6);
}

.delete::after,
.modal-close::after {
  background-color: rgba(255, 0, 0, 0.6);
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #000000;
  z-index: 1;
  border-radius: 4px;
  opacity: 0.09;
}
</style>
