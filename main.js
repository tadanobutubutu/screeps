tsx
isten.Vue.component('ScreepsIcon', {
    props: {
      icons: {
        type: Object,
        required: true,
      },
    },
    render(h) {
      const iconData = this.$props.icons;
      return h('img', {
        attrs: {
          src: iconData.icon,
          alt: iconData.alt || 'Screeps Icon',
          width: iconData.width || '32',
          height: iconData.height || '32',
          style: {
            display: 'block',
          },
        },
      });
    },
  });
export default VueLayout.extend({
  components: {
    ScreepsIcon,
  },
  data() {
    return {
      header: [],
      footer: [],
      pageTitle: '',
      layout: 'default',
      footerColors: ['#24005C', '#24005C'],
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🐛</text></svg>',
      icons: {
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
      },
    };
  },
  created() {
    const { title, header, footer } = this.$route.meta;
    if (title) this.pageTitle = title;
    if (Array.isArray(header)) this.header = header;
    if (Array.isArray(footer)) this.footer = footer;
  },
});