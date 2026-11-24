const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 10);
});

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


/* Show three entries before scrolling */

function updateScrollableLists() {
  document.querySelectorAll(
    '.news-list, .publication-list'
  ).forEach((list) => {

    const items = Array.from(list.children)
      .filter((item) => item.matches('article'));

    if (items.length <= 3) {
      list.classList.remove('is-scrollable');
      list.style.removeProperty('--visible-three-height');
      list.removeAttribute('tabindex');
      list.removeAttribute('role');
      list.removeAttribute('aria-label');
      return;
    }

    list.classList.add('is-scrollable');

    const gap = parseFloat(
      getComputedStyle(list).rowGap
    ) || 0;

    let height = gap * 2;

    items.slice(0, 3).forEach((item) => {
      const style = getComputedStyle(item);
      const padding =
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom);

      const borders =
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth);

      const summary = item.querySelector('summary');
      const date = item.querySelector('time');

      const contentHeight = summary
        ? Math.max(
            summary.getBoundingClientRect().height,
            date?.getBoundingClientRect().height || 0
          )
        : item.getBoundingClientRect().height
          - padding - borders;

      height += contentHeight + padding + borders;
    });

    list.style.setProperty(
      '--visible-three-height',
      `${Math.ceil(height) + 1}px`
    );

    list.setAttribute('tabindex', '0');
    list.setAttribute('role', 'region');
    list.setAttribute(
      'aria-label',
      list.classList.contains('news-list')
        ? 'Latest news, scroll for older entries'
        : 'Recent publications, scroll for older entries'
    );
  });
}

window.addEventListener('load', updateScrollableLists);
window.addEventListener('resize', updateScrollableLists);

document.fonts?.ready.then(updateScrollableLists);

