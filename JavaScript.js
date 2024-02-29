//khai báo biến
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $(".playlist");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const cd = $(".cd");
const btnPlay = $(".btn-toggle-play");
const btn = $(".player");
const volume = $("#volume");
const remaining = $(".remaining");
const firstTime = $(".duration");
const btnPre = $(".btn-prev");
const btnNext = $(".btn-next");
const progress = $(".progress");
const btnRepeat = $(".btn-repeat");
const btnRandom = $(".btn-random");
// phần mềm khởi chạy app music
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isPlayedSong: [],
    DefineProperty: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
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
    // Xây dựng khung sườn cho app phát nhạc
    formatTime: function (duration) {
        var minutes = Math.floor(duration / 60);
        var second = Math.floor(duration % 60);
        return minutes + ":" + (second < 10 ? "0" : "") + second;
    },
    loadCurrentSong: function () {  
        // cập nhật bài hát hiện tại đang phát
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        this.scrollToActive();
    },
    renderlistSong: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex? "active" : ""}"
                 data-index = '${index}' >
               <div class="thumb" style='background-image: url("${song.image}")'></div>
               <div class="body">
                   <h3 class='title'>${song.name}</h3>
                   <p class='author'>${song.singer}</p>
               </div>
               <div class="option"></div>
        </div>`;
        });
        playList.innerHTML = htmls.join("");
    },
    updateSongActive: function () {
        const songElements = $$(".song");
        songElements.forEach((songElement, index) => {
            if (index === this.currentIndex) {
                songElement.classList.add("active");
            } else {
                songElement.classList.remove("active");
            } 
        })
        this.scrollToActive();
    },
    scrollToActive: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.updateSongActive();
        this.loadCurrentSong();
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.updateSongActive();
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (
            newIndex === this.currentIndex ||
            this.isPlayedSong.includes(newIndex)
        );
        this.currentIndex = newIndex;
        this.isPlayedSong.push(newIndex);
        this.loadCurrentSong();
        this.updateSongActive();
        if (this.isPlayedSong.length === this.songs.length) {
            this.isPlayedSong = [];
        }
    },
    eventListener: function () {
        const _this = this;
        let intervalID;
        // cấu hình mặc định cho nhạc
        audio.volume = 0.5;
        volume.value = 50;
        // xử lý cdThumb
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        };
        const rotateCd = cdThumb.animate(
            { transform: "rotate(360deg)" },
            { duration: 10000, iterations: Infinity }
        );
        rotateCd.pause();
        // xử lý nút lặp và random
        btnRepeat.onclick = function (e) {
            if (_this.isRandom) {
                e.preventDefault();
            } else {
                _this.isRepeat = !_this.isRepeat;
                btnRepeat.classList.toggle("active", _this.isRepeat);
            }
        };
        btnRandom.onclick = function (e) {
            if (_this.isRepeat) {
                e.preventDefault();
            } else {
                _this.isRandom = !_this.isRandom;
                btnRandom.classList.toggle("active", _this.isRandom);
            }
        };
        // xử lý nút play và công tăc bật tắt phát nhạc
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            audio.onplay = function () {
                _this.isPlaying = true;
                btn.classList.add("playing");
                rotateCd.play();
                _this.intervalID = setInterval(() => {
                    if (!audio.duration) {
                        remaining.textContent = "00:00";
                        firstTime.textContent = "00:00";
                    } else {
                        remaining.textContent = _this.formatTime(audio.duration);
                        firstTime.textContent = _this.formatTime(audio.currentTime);
                    }
                }, 50);
            };
            audio.onpause = function () {
                _this.isPlaying = false;
                btn.classList.remove("playing");
                rotateCd.pause();
                clearInterval(_this.intervalID);
            };
            // xử lý nút tiến và nút lùi
            btnPre.onclick = function () {
                if (_this.isRepeat) {
                    _this.loadCurrentSong();
                } else if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.preSong();
                }
                audio.play();
            };
            btnNext.onclick = function () {
                if (_this.isRepeat) {
                    _this.loadCurrentSong();
                } else if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
            };
            // xử lý khi ấn vào playlist nhạc
            playList.onclick = function (e) {
                const songNode = e.target.closest(".song")
                if (songNode && !songNode.classList.contains("active")) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.updateSongActive();
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
            // xử lý thanh âm lượng của bài hát
            volume.oninput = function (e) {
                audio.volume = e.target.value / 100;
            };
            // xử lý tiến độ của bài hát và cập nhật theo thời gian thật
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    let progressPercent = Math.floor(
                        (audio.currentTime * 100) / audio.duration
                    );
                    progress.value = progressPercent;
                    progress.style.background = `linear-gradient(to right, #ec1f55 ${progressPercent}%  , #D3D3D3 ${progressPercent}% )`;
                }
            };
            // xử lý tác vụ khi ấn vào thanh input và chuyển đến đoạn cần phát
            progress.onchange = function (e) {
                let seekTime = Math.floor((e.target.value * audio.duration) / 100);
                audio.currentTime = seekTime;
            };
            // Xử lý khi bài hát kết thúc
            audio.onended = function () {
                if (_this.isRepeat) {
                    _this.loadCurrentSong();
                    audio.play();
                } else if (_this.isRandom) {
                    _this.randomSong();
                    audio.play();
                } else {
                    _this.nextSong();
                    audio.play();
                }
            };
        };
    },

    start: function () {
        // Định nghĩa song
        this.DefineProperty();
        // lắng nghe sự kiện và xử lý
        this.eventListener();
        // load hình ảnh hiện tại
        this.loadCurrentSong();
        // di chuyển website theo nhạc hiện tại
        this.scrollToActive();
        // load hình ảnh toàn bộ list nhạc
        this.renderlistSong();
    },
};
app.start();
