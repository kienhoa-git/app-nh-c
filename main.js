var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var cdThumb = $(".cd-thumb");
var header = $("header h2");
var playlist = $(".playlist");
var volume = $(".volume");
var random_button = $(".btn-random");
var next_button = $(".btn-next");
var pre_button = $(".btn-prev");
var play_button = $(".btn-toggle-play");
var repeat_button = $(".btn-repeat");
var button_animate = $(".player");
var cd = $(".cd");
var time_start = $(".duration");
var time_end = $(".remaining");
var progress = $(".progress");
const app = {
  Index: 0,
  Isplay: false,
  IsRepeat: false,
  IsRandom: false,
  Played: [],
  DefineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.Index];
      },
    });
  },
  songs: [
    {
      name: "Two Flower",
      singer: "vanguard sound",
      path: "../data/song 1.mp3",
      image: "./img/img1.png",
    },
    {
      name: "al higuchi",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "../data/song 2.mp3",
      image: "./img/img2.png",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./data/song 3.mp3",
      image: "./img/img3.png",
    },
    {
      name: "still here",
      singer: "LOL",
      path: "./data/song 4.mp3",
      image: "./img/img4.png",
    },
    {
      name: "Hiroyuki Sawano",
      singer: "vanguard sound",
      path: "./data/song 5.mp3",
      image: "./img/img5.png",
    },
    {
      name: "Haiiro no Saga",
      singer: "ChouCho",
      path: "./data/song 6.mp3",
      image: "./img/img6.png",
    },
    {
      name: "Dark Aria",
      singer: "XAI",
      path: "./data/song 7.mp3",
      image: "./img/img7.png",
    },
  ],
  // xử lí hình ảnh hiện tại
  renderPlaylist: function () {
    const htmls = this.songs.map((song, local) => {
      return `<div class="song ${
        local == this.Index ? "active" : ""
      }" data-index = '${local}'>
      <div class="thumb" style="background-image: url('${song.image}')"></div>
      <div class="body">
         <h3 class="title">${song.name}</h3>
         <p class="author">${song.singer}</p>
      </div>
      <div class="option"></div>
   </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  // load ảnh active
  loadActiveSong: function () {
    let actives = $$(".song");
    actives.forEach((active, currentIndex) => {
      if (this.Index == currentIndex) active.classList.add("active");
      else active.classList.remove("active");
    });
  },
  // load database ở hiện tại
  loadCurrentSong: function () {
    header.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  // format time
  formattime: function (number) {
    const minutes = Math.floor(number / 60);
    const sec = Math.floor(number % 60);
    return minutes + ":" + (sec < 10 ? "0" : "") + sec;
  },
  // nextSong
  nextsong: function () {
    this.Index++;
    if (this.Index >= this.songs.length) this.Index = 0;
    this.loadCurrentSong();
  },
  // presong
  presong: function () {
    this.Index--;
    if (this.Index < 0) this.Index = this.songs.length - 1;
    this.loadCurrentSong();
  },
  // randomSong
  randomsong: function () {
    let unit;
    do {
      unit = Math.floor(Math.random() * this.songs.length);
    } while (unit == this.Index || this.Played.includes(unit));
    this.Index = unit;
    this.Played.push(this.Index);
    if (this.Played.length == this.songs.length) this.Played = [];
    this.loadCurrentSong();
  },
  // xử lí  sự kiện bắt được
  EventList: function () {
    audio.volume = 0.5;
    volume.value = 50;
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    const rotale = cdThumb.animate(
      { transform: "rotate(360deg)" },
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    rotale.pause();
    // xử lí các sự kiện xảy ra khi user click
    play_button.onclick = () => {
      if (this.Isplay) audio.pause();
      else audio.play();
    };
    pre_button.onclick = () => {
      if (this.IsRandom) this.randomsong();
      else if (this.IsRepeat) this.loadCurrentSong();
      else this.presong();
      audio.play();
    };
    next_button.onclick = () => {
      if (this.IsRandom) this.randomsong();
      else if (this.IsRepeat) this.loadCurrentSong();
      else this.nextsong();
      audio.play();
    };
    random_button.onclick = () => {
      if (!this.IsRepeat) {
        random_button.classList.toggle("active");
        this.IsRandom = !this.IsRandom;
        if (this.IsRandom) this.Played.push(this.Index);
      }
    };
    repeat_button.onclick = () => {
      if (!this.IsRandom) {
        repeat_button.classList.toggle("active");
        this.IsRepeat = !this.IsRepeat;
      }
    };
    playlist.onclick = (e) => {
      let songNode = e.target.closest(".song");
      if (songNode && !songNode.classList.contains("active")) {
        this.Index = Number(songNode.dataset.index);
        this.loadActiveSong();
        this.loadCurrentSong();
        audio.play();
      }
    };
    // xử lý khi đến đoạn cuối của 1 bài hái
    audio.onended = () => {
      next_button.onclick();
    };
    // xử lý toàn bộ âm thanh khi đang chơi nhạc
    audio.onplay = () => {
      this.Isplay = true;
      rotale.play();
      button_animate.classList.add("playing");
      // xử lý sự kiện âm thanh cho bài hát khi đang chạy
      audio.ontimeupdate = () => {
        // xuất thời gian bài hát
        time_start.innerText = this.formattime(audio.currentTime);
        time_end.innerText = this.formattime(audio.duration);
        // xuất thanh value
        let progress_percent = Math.floor(
          (audio.currentTime * 100) / audio.duration
        );
        progress.value = progress_percent;
        progress.style.background = `linear-gradient(to right, #ec1f55 ${progress_percent}%  , #D3D3D3 ${progress_percent}%)`;
        // xuất hình ảnh đang đc phát
        this.loadActiveSong();
      };
    };
    progress.onchange = (e) => {
      let seeking = Math.floor((e.target.value * audio.duration) / 100);
      audio.currentTime = seeking;
    };
    // xử lý toàn bộ âm thanh khi đang tắt nhạc
    audio.onpause = () => {
      this.Isplay = false;
      rotale.pause();
      button_animate.classList.remove("playing");
    };
    // set âm thanh
    volume.oninput = () => {
      audio.volume = volume.value * 0.01;
    };
  },
  // quản lí file chạy
  run: function () {
    this.DefineProperty();
    this.renderPlaylist();
    this.EventList();
    this.loadCurrentSong();
  },
};
app.run();
