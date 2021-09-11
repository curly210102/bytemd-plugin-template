<script>
  import { Editor } from "bytemd";
  import "bytemd/dist/index.css";
  import plugin from "../../dist/index.cjs";

  let value;

  function handleChange(e) {
    value = e.detail.value;
  }

  const plugins = [plugin()];
</script>

<div class="container">
  <Editor
    {value}
    {plugins}
    placeholder={"Start writing with ByteMD"}
    on:change={handleChange}
  />
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  :global(body) {
    margin: 10px 10px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }
  :global(.bytemd) {
    height: calc(100vh - 20px);
  }
  :global(.medium-zoom-overlay) {
    z-index: 100;
  }
  :global(.medium-zoom-image--opened) {
    z-index: 101;
  }
</style>
