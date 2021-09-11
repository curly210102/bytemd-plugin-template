<script>
  import { Editor } from "@curly210102/bytemd";
  import "@curly210102/bytemd/dist/index.min.css";

  let value;
  const plugins = [
    // Add more plugins here
  ];

  function handleChange(e) {
    value = e.detail.value;
  }
</script>

<Editor {value} {plugins} on:change={handleChange} />
