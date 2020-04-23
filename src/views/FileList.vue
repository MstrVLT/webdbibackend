<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title has-text-centered">DBI backend</h1>
        <div class="box is-shadowless">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  Работает только в браузере Chrome и только в Linux, OSX,
                  Android (без рута) и на Chromebooks!
                  <a @click="helpdialog = true">
                    Решение проблем для пользователей Linux
                  </a>
                </p>
              </div>
            </div>
          </article>
        </div>


        <div class="notification is-danger is-light" v-if="error">
          Данный тип браузера. не поддерживается!
        </div>


        <div class="" :class="[{ 'is-active': helpdialog }, 'modal']">
          <div class="modal-background" @click="helpdialog = false"></div>
          <div class="modal-content">
            <div class="box">
              <article class="media">
                <div class="media-content">
                  <div class="content">
                    <p>
                      В Linux при попытке подключиться могут возникать ошибки
                      типа 'Access Denied' или 'No Compatible Device'! Если у
                      вас так, попробуйте создать файл в
                      <code>/etc/udev/rules.d/50-switch.rules</code>
                      Со следующим содержимым:
                      <code
                        >SUBSYSTEM=="usb", ATTR{idVendor}=="0955", MODE="0664",
                        GROUP="plugdev"</code
                      >
                      Далее добавьте себя в группу plugdev командой
                      <code>sudo usermod -a -G plugdev YOUR_NAME</code>
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            @click="helpdialog = false"
          ></button>
        </div>

        <nav class="panel is-link" v-if="!error">
          <div class="panel-block" v-if="!serverStarted">
            <div class="container">
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
                  { 'is-outlined': files.length === 0 },
                  'button is-link is-fullwidth is-light'
                ]"
                @click="$refs.file.click()"
              >
                1. Добавить ( .nsz .nsp .xci )
              </button>
            </div>
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
              <div class="container">
                <button
                  :class="[
                    { 'is-outlined': files.length > 0 },
                    'button is-link is-fullwidth is-light'
                  ]"
                  @click="startServer()"
                >
                  2. Запустить сервер
                </button>
              </div>
            </div>

          </div>

        </nav>

        <div class="notification is-success is-light" v-if="serverStarted">
          Подключите Nintendo Switch!
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { dbi } from './../dbi.js';

export default {
  name: "Home",
  data: function() {
    return {
      dbi: null,
      files: [],
      serverStarted: false,
      helpdialog: false,
      error: false
    };
  },
  created() {
    if (!('usb' in navigator)) {
      this.error = true;
    }
    this.dbi = new dbi();
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
      e.target.files.forEach(fileNew => {
        let result = this.files.find(file => {
          return fileNew.name === file.name;
        });
        if (this.files.length === 0 || !result) {
          this.files.push(fileNew);
        }
      });
    },
    startServer() {
      this.serverStarted = true;
      this.dbi.connect()
    },
    removeFile(index) {
      if (index > -1) {
        this.files.splice(index, 1);
      }
    }
  }
};
</script>

<style>
.message-header {
  font-weight: 400 !important;
}

.delete {
  background-color: #ffffff;
}

.delete:hover,
.delete:focus {
  background-color: #ffffff;
}

.delete:active {
  background-color: #ffffff;
}

.delete::before {
  background-color: rgba(255, 0, 0, 0.6);
}

.delete::after {
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
