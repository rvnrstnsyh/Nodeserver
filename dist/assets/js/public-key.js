new Vue({
  delimiters: ["[[", "]]"],
  el: "#publicKey",
  vuetify: new Vuetify(),
  data() {
    return {
      showPublicKey: false,
      copied: false,
    };
  },
  mounted() {
    setTimeout(() => {
      document.querySelectorAll("#waitForMounted").forEach((el) => {
        el.style.display = "block";
      });
    }, 500);
  },
  methods: {
    copyPublicKey() {
      const publicKey = document.getElementById("keybody").textContent;
      const new_textArea = document.createElement("textarea");
      new_textArea.textContent = publicKey;
      document.body.append(new_textArea);
      new_textArea.select();
      if (document.execCommand("Copy")) {
        this.copied = true;
      }
      new_textArea.remove();
    },
  },
});
