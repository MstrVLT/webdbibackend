<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title has-text-centered">DBI backend</h1>
        <div class="box">
<!--          <article class="media">-->
<!--            <div class="media-content">-->
<!--              <figure class="image is-128x128" style="left: 50%;margin-right: -50%;transform: translate(-50%, 0%);">-->
<!--                <img class="is-rounded" src="bio-photo.png">-->
<!--              </figure>-->
<!--            </div>-->
<!--          </article>-->
        <article class="media">
          <div class="media-content">
            <div class="content">
              <p>Работает только в браузере Chrome и только в Linux, OSX, Android (без рута) и на Chromebooks!
                <a
                        @click="helpdialog = true"
                >
                  Решение проблем для пользователей Linux
                </a>
              </p>

            </div>
          </div>
        </article>
        </div>

        <div class=""
             :class="[
                { 'is-active': helpdialog },
                'modal'
              ]">
          <div class="modal-background" @click="helpdialog = false"></div>
          <div class="modal-content">
            <div class="box">
              <article class="media">
                <div class="media-content">
                  <div class="content">
                    <p>
                      В Linux при попытке подключиться могут возникать ошибки типа 'Access Denied' или 'No Compatible Device'! Если у вас так, попробуйте создать файл в
                      <code>/etc/udev/rules.d/50-switch.rules</code>
                      Со следующим содержимым:
                      <code>SUBSYSTEM=="usb", ATTR{idVendor}=="0955", MODE="0664", GROUP="plugdev"</code>
                      Далее добавьте себя в группу plugdev командой
                      <code>sudo usermod -a -G plugdev YOUR_NAME</code>
                    </p>
                  </div>
                </div>
              </article>
<!--              <article class="media">-->
<!--                <div class="media-content">-->
<!--                  <div class="content">-->
<!--                    <p>-->
<!--                      This has been tested and appears to work on Linux, OSX, Android (unrooted) and Chromebooks. Your mileage may vary.-->
<!--                    </p>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </article>-->
            </div>
          </div>
          <button class="modal-close is-large" aria-label="close" @click="helpdialog = false"></button>
        </div>

<!--        <figure class="image is-128x128" style="left: 50%;margin-right: -50%;transform: translate(-50%, -20%);">-->
<!--          <img class="is-rounded" src="bio-photo.png">-->
<!--        </figure>-->
<!--        <h2 class="subtitle">-->
<!--          This may or may not work on Windows due to a limitation in the Chrome implementation of WebUSB (and probably other reasons!). In our testing, it will sometimes work so give it a shot, but be wary.-->

<!--          This does ONLY work on chromium-based browsers (Brave, Chrome, etc.), as they are the only ones with a working WEBCFW implementation.-->

<!--          On Linux, you might get an 'Access Denied' or 'No Compatible Device' error on the Connect dialog! If you do, you can try creating a file at /etc/udev/rules.d/50-switch.rulesWith the following contents:-->
<!--          SUBSYSTEM=="usb", ATTR{idVendor}=="0955", MODE="0664", GROUP="plugdev" and afterwards add yourself to the plugdev group by typing sudo usermod -a -G plugdev YOUR_NAME-->
<!--          This has been tested and appears to work on Linux, OSX, Android (unrooted) and Chromebooks. Your mileage may vary.-->
<!--        </h2>-->

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
              :class="[
                { 'is-outlined': files.length > 0 },
                'button is-fullwidth'
              ]"
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
                    {{ file.name }}
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
                class="button is-fullwidth"
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
      serverStarted: false,
      helpdialog: false
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
        // console.log(fileNew);
        // let result = this.files.find(file => {
        //   return fileNew.name === file.name;
        // });
        // if (this.files.length === 0 || !result) {
        //   this.files.push(fileNew);
        // }
        this.files.push(fileNew);
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

.delete{
  background-color: #ffffff;
}

.delete:hover,
.delete:focus {
  background-color: #ffffff;
}

.delete:active{
  background-color: #ffffff;
}

.delete::before {
  background-color: rgba(255, 0, 0, 0.6);
}

.delete::after{
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
