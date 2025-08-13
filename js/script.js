
// main text animation
$(function () {
  // 1. Привет, это – down to up
  let upTextEl = $('.animated-up');
  let upText = upTextEl.text();
  upTextEl.empty();

  $.each(upText.split(''), function (i, char) {
    $('<span>')
      .text(char)
      .css('animation-delay', (i * 0.05) + 's')
      .appendTo(upTextEl);
  });

  // 2. Твой Код Личности – left to right
  let typeJsText = document.querySelector(".typeJsText");
  let fullText = typeJsText.dataset.typetext;
  let counter = 0;

  typeJsText.innerHTML = "";

  function typeJs() {
    if (counter < fullText.length) {
      typeJsText.innerHTML += fullText.charAt(counter);
      counter++;
    } else {
      clearInterval(typingInterval); // yozib bo‘lgach to‘xtaydi
    }
  }

  let typingInterval = setInterval(typeJs, 50);
});


// main counter
$(function () {
  var $center = $(".main-numbers .center");

  // Sanash ketma-ketligi
  var sequences = [
    [1, 11],
    [11, 4],
    [4, 15],
    [15, 1],
    [1, 8],
    [8, 18],
    [18, 6],
    [6, 1]
  ];

  var stepIndex = 0;

  function count(from, to, callback) {
    var current = from;
    $center.text(current);
    var step = from < to ? 1 : -1;

    var timer = setInterval(function () {
      current += step;
      $center.text(current);
      if (current === to) {
        clearInterval(timer);
        setTimeout(callback, 600); // pauza
      }
    }, 200); // sanash tezligi
  }

  function runSequence() {
    var seq = sequences[stepIndex];
    count(seq[0], seq[1], function () {
      stepIndex = (stepIndex + 1) % sequences.length;
      runSequence();
    });
  }

  runSequence();
});



// Faqat bir marta progressni boshlash uchun flag
let progressStarted = false;

function startUpAnimation() {
  if (progressStarted) return; // allaqachon boshlangan bo‘lsa, qaytish
  progressStarted = true;
  startProgress();
}

function startProgress() {
  let $percent = $(".percent-value");
  let $pauseNumbers = $(".pause-number");
  let $progress = $(".progress");

  let currentPercent = 0;
  let speed = 50; // progress yangilanish tezligi
  let pauses = [1, 20, 40, 60, 80, 100];
  let pauseIndex = 0;
  let maxRand = 0;

  $(".matrix").hide();

  function updateProgress(percent) {
    let deg = (percent / 100) * 360;
    $progress.css(
      "background",
      `conic-gradient(#D0B15A ${deg}deg, rgba(148, 153, 129, 0) ${deg}deg)`
    );
  }

  let usedIndexes = [];

  function goNext() {
    if (currentPercent < 100) {
      currentPercent++;
      $percent.text(currentPercent + "%");
      updateProgress(currentPercent);

      if (currentPercent === pauses[pauseIndex]) {
        let availableIndexes = $pauseNumbers
          .map((i) => !usedIndexes.includes(i) ? i : null)
          .get();

        if (availableIndexes.length === 0) {
          goNext();
          return;
        }

        let randIdx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        usedIndexes.push(randIdx);

        let $activeNum = $pauseNumbers.eq(randIdx);
        $pauseNumbers.removeClass("active");
        $activeNum.addClass("active");

        let $b = $activeNum.find("b");
        maxRand = Math.random() < 0.5 ? 10 : 20;

        let counter = 1;
        $b.text(counter);

        let pauseInterval = setInterval(function () {
          if (counter < maxRand) {
            counter++;
            $b.text(counter);
          } else {
            clearInterval(pauseInterval);
          }
        }, 100);

        pauseIndex++;

        setTimeout(function () {
          goNext();
        }, 1000);

        return;
      }

      setTimeout(goNext, speed);
    } else {
      $(".first-show").fadeOut(500, function () {
        $(".matrix").fadeIn(500);
      });
    }
  }

  goNext();
}

// Misol uchun goToStep funksiyasi
function goToStep(index) {
  let steps = $('.tab-steps--list li');
  let contents = $(".tab-steps > li");

  if (index < 0) index = 0;
  if (index >= steps.length) index = steps.length - 1;

  steps.removeClass("active").eq(index).addClass("active");
  contents.removeClass("active").eq(index).addClass("active");

  // Agar 4-chi step active bo‘lsa, progressni boshlash
  if ($('.tab-steps--four').hasClass('active')) {
    startUpAnimation();
  }
}





$(document).ready(function () {

  // Gender buttonlarni default holatga qaytarish
  function resetGenderButtons() {
    $('.gender-button').removeClass('active inactive');
  }

  // Animate spans funksiyasi (tab-step 4 uchun)
  function startAnimateSpans() {
    const $spans = $('.animate-spans span');
    let currentIndex = 0;
    const count = $spans.length;

    $spans.removeClass('active'); // oldingi active larni tozalash
    $spans.eq(currentIndex).addClass('active');

    function showNext() {
      // Oldingisini faqat oxirgi bo‘lmasa o‘chir
      if (currentIndex < count - 1) {
        $spans.eq(currentIndex).removeClass('active');
        currentIndex++;
        $spans.eq(currentIndex).addClass('active');
        setTimeout(showNext, 2200);
      }
      // agar oxirgi span bo‘lsa — class qoladi va to‘xtaydi
    }

    setTimeout(showNext, 2200);
  }

  let animateSpansInterval; // animate spans intervalni saqlash

  // Tab-step funksiyasi
  function goToStep(index) {
    let steps = $('.tab-steps--list li');
    let contents = $(".tab-steps > li");

    if (index < 0) index = 0;
    if (index >= steps.length) index = steps.length - 1;

    // Step list aktiv holat
    steps.each(function (i) {
      $(this).toggleClass('active', i <= index);
    });

    // Step content aktiv holat
    contents.removeClass("active");
    contents.eq(index).addClass("active");

    // tab-steps--one active bo'lsa list opacity 0 bo'ladi
    if ($('.tab-steps--one').hasClass('active')) {
      $('.tab-steps--list').css('opacity', '0');
    } else {
      $('.tab-steps--list').css('opacity', '1');
    }

    // Step 4 (index 3) bo‘lsa animatsiyalar ishga tushadi
    if (index === 3) {
      startProgress();

      if (animateSpansInterval) clearInterval(animateSpansInterval);
      animateSpansInterval = startAnimateSpans();

      startUpAnimation();
    }

    // Agar step 0 ga qaytilsa gender buttonlarni reset qilamiz
    if (index === 0) {
      resetGenderButtons();
    }
  }

  // Next tugmasi
  $('.next').click(function (e) {
    e.preventDefault();
    let currentIndex = $('.tab-steps--list li.active').last().index();
    setTimeout(function () {
      goToStep(currentIndex + 1);
    }, 1000);
  });

  // Prev tugmasi
  $('.prev').click(function (e) {
    e.preventDefault();
    let currentIndex = $('.tab-steps--list li.active').last().index();
    setTimeout(function () {
      goToStep(currentIndex - 1);
    }, 1000);
  });

  // Step bosilganda
  $('.tab-steps--list li').click(function () {
    let targetIndex = $(this).index();
    setTimeout(function () {
      goToStep(targetIndex);
    }, 1000);
  });

  $('.gender-button.next').click(function () {
    if ($(this).hasClass('active')) return;

    $(this).addClass('active');
    $('.gender-button').not(this).addClass('inactive');

    setTimeout(() => {
      goToStep(1); // 2-chi stepga o'tish
    }, 1000);
  });

});




$(document).ready(function () {
  // dropdown
  $(".dropdown-btn").on("click", function () {
    let $dropdown = $(this).closest(".dropdown");
    let $menu = $dropdown.find(".dropdown-menu");

    // Yopiq bo‘lsa ochamiz, ochiq bo‘lsa yopamiz
    $menu.stop(true, true).slideToggle(300);
    $dropdown.toggleClass("active");
  });


  $('.relationship-item').click(function () {
    $('.relationship-item').removeClass('active');
    $(this).addClass('active');
  });


  // Modalni ochish
  $(".open-modal").click(function () {
    var modalID = $(this).data("modal");
    $(modalID).css("display", "flex").hide().fadeIn(200);
  });

  // Modalni yopish
  $(".modal-close, .modal-overlay").click(function (e) {
    if (e.target !== this) return; // faqat overlay yoki close tugma bosilganda yopiladi
    $(this).closest(".modal-overlay").fadeOut(200);
  });


  // pay select
  $('.pay-select .white-btn').click(function () {
    $('.pay-select .white-btn').removeClass('active');
    $(this).addClass('active');
  });

  // Card number formatlash 0000 0000 0000 0000
  $('#card-number').on('input', function () {
    let value = $(this).val().replace(/\D/g, '').slice(0, 16);
    let formatted = value.replace(/(.{4})/g, '$1 ').trim();
    $(this).val(formatted);
  });

  // Expiration date formatlash MM/YY
  $('#card-date').on('input', function () {
    let value = $(this).val().replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    $(this).val(value);
  });

  // CVC input (faqat raqam)
  $('#card-cvc').on('input', function () {
    let value = $(this).val().replace(/\D/g, '').slice(0, 4);
    $(this).val(value);
  });

});



$(document).ready(function () {
  let modalOpened = false; // Modal ochilganini belgilovchi flag
  let modalTimer = null;   // Timer ID

  // Modalni qo'lda ochish
  $(".open-modal").click(function () {
    var modalID = $(this).data("modal");
    $(modalID).fadeIn(200).css("display", "flex");
  });

  // Modal yopish
  $(".modal-close, .modal-overlay").click(function (e) {
    if ($(e.target).hasClass("modal-overlay") || $(e.target).hasClass("modal-close")) {
      $(".modal-overlay").fadeOut(200);
      modalOpened = true; // Yopilgandan keyin qaytib ochilmasligi uchun
      if (modalTimer) {
        clearTimeout(modalTimer); // Timer to'xtatish
      }
    }
  });

  // Tab holatini tekshirish
  function checkAndOpenModal() {
    // Agar 4-step active bo'lsa va modal hali ochilmagan bo'lsa
    if ($(".tab-steps--four").hasClass("active") && !modalOpened && !modalTimer) {
      modalTimer = setTimeout(function () {
        $("#modal1").fadeIn(200).css("display", "flex");
        modalOpened = true; // Faqat bir marta ochiladi
      }, 15000); // 5 sekund
    } else if (!$(".tab-steps--four").hasClass("active") && modalTimer) {
      // Agar stepdan chiqib ketilsa — timer to‘xtatiladi
      clearTimeout(modalTimer);
      modalTimer = null;
    }
  }

  // Class o‘zgarishini kuzatish
  const observer = new MutationObserver(checkAndOpenModal);
  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
});







const easing = {
  easeOutCubic: function (pos) {
    return (Math.pow((pos - 1), 3) + 1);
  },
  easeOutQuart: function (pos) {
    return -(Math.pow((pos - 1), 4) - 1);
  },
};

class IosSelector {
  constructor(options) {
    let defaults = {
      el: '', // DOM элемент
      type: 'normal', // infinite - бесконечная прокрутка, normal - обычная
      count: 20, // Кол-во элементов на кольце, должно быть кратно 4
      sensitivity: 0.8, // Чувствительность
      source: [], // Опции {value: xx, text: xx}
      value: null,
      onChange: null
    };

    this.options = Object.assign({}, defaults, options);
    this.options.count = this.options.count - this.options.count % 4;
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 10; // Замедление прокрутки
    this.minV = Math.sqrt(1 / this.a); // Минимальная начальная скорость
    this.selected = this.source[0];

    this.exceedA = 10; // Замедление при выходе за пределы
    this.moveT = 0; // requestAnimationFrame id
    this.moving = false;

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null,
      highlight: null,
      highlightList: null,
      highListItems: null
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    };

    this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count;
    this.itemAngle = 360 / this.options.count;
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180);

    this.scroll = 0;
    this._init();
  }

  _init() {
    this._create(this.options.source);

    let touchData = {
      startY: 0,
      yArr: []
    };

    for (let eventName in this.events) {
      this.events[eventName] = ((eventName) => {
        return (e) => {
          if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
            e.preventDefault();
            if (this.source.length) {
              this['_' + eventName](e, touchData);
            }
          }
        };
      })(eventName);
    }

    this.elems.el.addEventListener('touchstart', this.events.touchstart);
    document.addEventListener('mousedown', this.events.touchstart);
    this.elems.el.addEventListener('touchend', this.events.touchend);
    document.addEventListener('mouseup', this.events.touchend);
    if (this.source.length) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  _touchstart(e, touchData) {
    this.elems.el.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('mousemove', this.events.touchmove);
    let eventY = e.clientY || e.touches[0].clientY;
    touchData.startY = eventY;
    touchData.yArr = [[eventY, new Date().getTime()]];
    touchData.touchScroll = this.scroll;
    this._stop();
  }

  _touchmove(e, touchData) {
    let eventY = e.clientY || e.touches[0].clientY;
    touchData.yArr.push([eventY, new Date().getTime()]);
    if (touchData.length > 5) {
      touchData.unshift();
    }

    let scrollAdd = (touchData.startY - eventY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.scroll;

    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.source.length) {
        moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
      }
    } else {
      moveToScroll = this._normalizeScroll(moveToScroll);
    }

    touchData.touchScroll = this._moveTo(moveToScroll);
  }

  _touchend(e, touchData) {
    this.elems.el.removeEventListener('touchmove', this.events.touchmove);
    document.removeEventListener('mousemove', this.events.touchmove);

    let v;

    if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      let startTime = touchData.yArr[touchData.yArr.length - 2][1];
      let endTime = touchData.yArr[touchData.yArr.length - 1][1];
      let startY = touchData.yArr[touchData.yArr.length - 2][0];
      let endY = touchData.yArr[touchData.yArr.length - 1][0];

      v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
      let sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    this.scroll = touchData.touchScroll;
    this._animateMoveByInitV(v);
  }

  _create(source) {
    if (!source.length) return;

    let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
          {{circleListHTML}}
        </ul>
        <div class="highlight">
          <ul class="highlight-list">
            {{highListHTML}}
          </ul>
        </div>
      </div>
    `;

    if (this.options.type === 'infinite') {
      let concatSource = [].concat(source);
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    this.source = source;
    let sourceLength = source.length;

    let circleListHTML = '';
    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="select-option"
                    style="
                      top: ${this.itemHeight * -0.5}px;
                      height: ${this.itemHeight}px;
                      line-height: ${this.itemHeight}px;
                      transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`;
    }

    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`;
    }

    if (this.options.type === 'infinite') {
      for (let i = 0; i < this.quarterCount; i++) {
        circleListHTML = `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` + circleListHTML;
        circleListHTML += `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
      }

      highListHTML = `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                          ${source[sourceLength - 1].text}
                      </li>` + highListHTML;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`;
    }

    this.elems.el.innerHTML = template
      .replace('{{circleListHTML}}', circleListHTML)
      .replace('{{highListHTML}}', highListHTML);

    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');
    this.elems.highlight = this.elems.el.querySelector('.highlight');
    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitems = this.elems.el.querySelectorAll('.highlight-item');

    if (this.type === 'infinite') {
      this.elems.highlightList.style.top = -this.itemHeight + 'px';
    }

    this.elems.highlight.style.height = this.itemHeight + 'px';
    this.elems.highlight.style.lineHeight = this.itemHeight + 'px';
  }

  _normalizeScroll(scroll) {
    let normalizedScroll = scroll;
    while (normalizedScroll < 0) {
      normalizedScroll += this.source.length;
    }
    return normalizedScroll % this.source.length;
  }

  _moveTo(scroll) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }
    this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll) * this.itemHeight}px, 0)`;

    [...this.elems.circleItems].forEach(itemElem => {
      if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
        itemElem.style.visibility = 'hidden';
      } else {
        itemElem.style.visibility = 'visible';
      }
    });

    return scroll;
  }

  async _animateMoveByInitV(initV) {
    let initScroll, finalScroll, totalScrollLen, a, t;

    if (this.type === 'normal') {
      if (this.scroll < 0 || this.scroll > this.source.length - 1) {
        a = this.exceedA;
        initScroll = this.scroll;
        finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
        totalScrollLen = initScroll - finalScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        initV = a * t;
        initV = this.scroll > 0 ? -initV : initV;
        await this._animateToScroll(initScroll, finalScroll, t);
      } else {
        initScroll = this.scroll;
        a = initV > 0 ? -this.a : this.a;
        t = Math.abs(initV / a);
        totalScrollLen = initV * t + a * t * t / 2;
        finalScroll = Math.round(this.scroll + totalScrollLen);
        finalScroll = Math.max(0, Math.min(finalScroll, this.source.length - 1));
        totalScrollLen = finalScroll - initScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
      }
    } else {
      initScroll = this.scroll;
      a = initV > 0 ? -this.a : this.a;
      t = Math.abs(initV / a);
      totalScrollLen = initV * t + a * t * t / 2;
      finalScroll = Math.round(this.scroll + totalScrollLen);
      await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
    }

    this._selectByScroll(this.scroll);
  }

  _animateToScroll(initScroll, finalScroll, t, easingName = 'easeOutQuart') {
    if (initScroll === finalScroll || t === 0) {
      this._moveTo(initScroll);
      return;
    }

    let start = new Date().getTime() / 1000;
    let totalScrollLen = finalScroll - initScroll;

    return new Promise((resolve) => {
      this.moving = true;
      let tick = () => {
        let pass = new Date().getTime() / 1000 - start;
        if (pass < t) {
          this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
          this.moveT = requestAnimationFrame(tick);
        } else {
          resolve();
          this._stop();
          this.scroll = this._moveTo(initScroll + totalScrollLen);
        }
      };
      tick();
    });
  }

  _stop() {
    this.moving = false;
    cancelAnimationFrame(this.moveT);
  }

  _selectByScroll(scroll) {
    scroll = this._normalizeScroll(scroll) | 0;
    if (scroll > this.source.length - 1) {
      scroll = this.source.length - 1;
      this._moveTo(scroll);
    }
    this._moveTo(scroll);
    this.scroll = scroll;
    this.selected = this.source[scroll];
    this.value = this.selected.value;
    this.onChange && this.onChange(this.selected);
  }

  updateSource(source) {
    this._create(source);
    if (!this.moving) {
      this._selectByScroll(this.scroll);
    }
  }

  select(value) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        window.cancelAnimationFrame(this.moveT);
        let initScroll = this._normalizeScroll(this.scroll);
        let finalScroll = i;
        let t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
        this._animateToScroll(initScroll, finalScroll, t);
        setTimeout(() => this._selectByScroll(i));
        return;
      }
    }
    throw new Error(`Не удалось выбрать значение: ${value}, соответствия в источнике нет`);
  }

  destroy() {
    this._stop();
    for (let eventName in this.events) {
      this.elems.el.removeEventListener(eventName, this.events[eventName]);
    }
    document.removeEventListener('mousedown', this.events['touchstart']);
    document.removeEventListener('mousemove', this.events['touchmove']);
    document.removeEventListener('mouseup', this.events['touchend']);
    this.elems.el.innerHTML = '';
    this.elems = null;
  }
}

// Логика даты
function getYears() {
  let currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => ({
      value: 1900 + i,
      text: 1900 + i
    })
  );
}

function getMonths() {
  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  return monthNames.map((name, index) => ({
    value: index + 1, // 1–12
    text: name
  }));
}

function getDays(year, month) {
  let dayCount = new Date(year, month, 0).getDate();
  let days = [];
  for (let i = 1; i <= dayCount; i++) {
    days.push({
      value: i,
      text: i,
    });
  }
  return days;
}

let currentYear = new Date().getFullYear();
let currentMonth = 1;
let currentDay = 1;

let yearSelector;
let monthSelector;
let daySelector;

let yearSource = getYears();
let monthSource = getMonths();
let daySource = getDays(currentYear, currentMonth);

yearSelector = new IosSelector({
  el: '#year1',
  type: 'normal',
  source: yearSource,
  count: 20,
  onChange: (selected) => {
    currentYear = selected.value;
    daySource = getDays(currentYear, currentMonth);
    daySelector.updateSource(daySource);

    console.log(`${yearSelector.value} - ${monthSelector.source.find(m => m.value === monthSelector.value).text} - ${daySelector.value}`);
  }
});

monthSelector = new IosSelector({
  el: '#month1',
  type: 'normal',
  source: monthSource,
  count: 20,
  onChange: (selected) => {
    currentMonth = selected.value;
    daySource = getDays(currentYear, currentMonth);
    daySelector.updateSource(daySource);

    console.log(`${yearSelector.value} - ${monthSelector.source.find(m => m.value === monthSelector.value).text} - ${daySelector.value}`);
  }
});

daySelector = new IosSelector({
  el: '#day1',
  type: 'normal',
  source: [],
  count: 20,
  onChange: (selected) => {
    currentDay = selected.value;

    console.log(`${yearSelector.value} - ${monthSelector.source.find(m => m.value === monthSelector.value).text} - ${daySelector.value}`);
  }
});


let now = new Date();
setTimeout(function () {
  yearSelector.select(now.getFullYear());
  monthSelector.select(now.getMonth() + 1);
  daySelector.select(now.getDate());
});
