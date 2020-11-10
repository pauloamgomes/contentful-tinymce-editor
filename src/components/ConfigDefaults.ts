export interface AppInstallationParameters {
  apiKey: string;
  plugins: string;
  toolbar: string;
  assetgroup: string;
  extragroup: string;
  formatgroup: string;
  insertgroup: string;
  quickbarsSelectionToolbar: string;
  menubar: boolean;
  customcolors: boolean;
  custompalette: boolean;
  resizing: string;
  colormap: string[];
  customContentStyle: string;
}

export const colormap: string[] = [
  "#BFEDD2",
  "Light Green",
  "#FBEEB8",
  "Light Yellow",
  "#F8CAC6",
  "Light Red",
  "#ECCAFA",
  "Light Purple",
  "#C2E0F4",
  "Light Blue",

  "#2DC26B",
  "Green",
  "#F1C40F",
  "Yellow",
  "#E03E2D",
  "Red",
  "#B96AD9",
  "Purple",
  "#3598DB",
  "Blue",

  "#169179",
  "Dark Turquoise",
  "#E67E23",
  "Orange",
  "#BA372A",
  "Dark Red",
  "#843FA1",
  "Dark Purple",
  "#236FA1",
  "Dark Blue",

  "#ECF0F1",
  "Light Gray",
  "#CED4D9",
  "Medium Gray",
  "#95A5A6",
  "Gray",
  "#7E8C8D",
  "Dark Gray",
  "#34495E",
  "Navy Blue",

  "#000000",
  "Black",
  "#ffffff",
  "White",
];

export const defaultParameters: AppInstallationParameters = {
  apiKey: "",
  plugins:
    "preview advlist autolink lists link image charmap anchor searchreplace visualblocks visualchars code fullscreen insertdatetime media table paste wordcount autoresize hr nonbreaking paste quickbars emoticons",
  toolbar:
    "undo redo | styleselect | bold italic underline formatgroup | bullist numlist | table assetgroup link | insertgroup | extragroup",
  formatgroup:
    "strikethrough superscript subscript | alignleft aligncenter alignright | indent outdent | forecolor backcolor | removeformat",
  insertgroup:
    "media emoticons charmap emoji hr anchor insertdatetime nonbreaking",
  assetgroup: "existingasset newasset",
  extragroup:
    "paste pastetext | visualchars visualblocks preview wordcount | searchreplace | code",
  quickbarsSelectionToolbar:
    "bold italic underline | formatselect | quicklink blockquote",
  menubar: false,
  customcolors: false,
  custompalette: false,
  colormap: colormap,
  resizing: "fit=fill&w=1024&q=80",
  customContentStyle:
    "img { max-width: 100% !important; max-height: 400px; object-fit: cover; }",
};
