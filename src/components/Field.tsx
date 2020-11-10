import React from "react";
import { FieldExtensionSDK } from "contentful-ui-extensions-sdk";
import { Editor } from "@tinymce/tinymce-react";

import { AppInstallationParameters } from "./ConfigDefaults";
import { Spinner } from "@contentful/forma-36-react-components";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface ImageProps {
  id: string;
  url: string;
  width: string;
  height: string;
  title?: string;
}

interface LinkProps {
  id: string;
  url: string;
  title: string;
}

const Field = (props: FieldProps) => {
  const sdk = props.sdk;
  const { apiKey } = sdk.parameters.installation as AppInstallationParameters;

  const [init, setInit] = React.useState(null as any);
  const [value, setValue] = React.useState(sdk.field.getValue());

  let debounceInterval: any = false;

  const onExternalChange = (externalValue: string) => {
    setValue(externalValue);
  };

  React.useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  React.useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    return sdk.field.onValueChanged(onExternalChange);
  });

  React.useEffect(() => {
    const {
      formatgroup,
      insertgroup,
      assetgroup,
      extragroup,
      plugins,
      menubar,
      toolbar,
      customcolors,
      custompalette,
      colormap,
      quickbarsSelectionToolbar,
      resizing,
      customContentStyle,
    } = sdk.parameters.installation as AppInstallationParameters;

    const renderImage = ({ id, url, width, height, title = "" }: ImageProps) =>
      `<img
        src="${url}?${resizing}"
        width="${width}"
        height="${height}"
        alt="${title}"
        data-contentful-id="${id}"
        data-original-width="${width}"
        data-original-height="${height}"
      />`;

    const renderLink = ({ id, url, title }: LinkProps) =>
      `<a href="${url}" data-contentful-id="${id}">${title}</a>`;

    const renderContent = (data: any) => {
      const { assetType, id, title, url, width, height } = data;

      return assetType === "image"
        ? renderImage({ id, url, width, height, title })
        : renderLink({ id, url, title });
    };

    const setupEditor = (editor: any) => {
      editor.ui.registry.addButton("existingasset", {
        text: "Link existing",
        icon: "edit-image",
        tooltip: "Insert existing Contentful Media Asset",
        onAction: async () => {
          await handleSelectAsset().then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addButton("newasset", {
        text: "Add new and link",
        icon: "image",
        tooltip: "Create and Insert Contentful Media Asset",
        onAction: async () => {
          await handleCreateAsset().then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addButton("editasset", {
        text: "Edit media asset",
        icon: "image",
        tooltip: "Edit Contentful Media Asset",
        onAction: async () => {
          const node = editor.selection.getNode();
          const parts = node
            .getAttribute("src")
            .replace(/(http:|https:)?\/\/.*\.ctfassets\.net\//, "")
            .replace(`${sdk.ids.space}/`, "")
            .split("/");

          await handleEditAsset(parts[0]).then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addContextToolbar("editasset", {
        predicate: (node: any) => {
          return (
            node.nodeName.toLowerCase() === "img" &&
            node.getAttribute("src").includes(`ctfassets.net/${sdk.ids.space}/`)
          );
        },
        items: "editasset",
        position: "node",
        scope: "node",
      });
    };

    const getAssetData = (asset: any | null) => {
      if (asset?.fields?.file && asset?.fields?.file[sdk.field.locale]) {
        const assetType = /^image\/(.*)$/.test(
          asset.fields.file[sdk.field.locale].contentType
        )
          ? "image"
          : "file";

        const data: any = {
          assetType,
          id: asset.sys.id,
          url: asset.fields.file[sdk.field.locale].url,
          title: asset.fields.title[sdk.field.locale],
        };

        if (assetType === "image") {
          data.width = asset.fields.file[sdk.field.locale].details.image.width;
          data.height =
            asset.fields.file[sdk.field.locale].details.image.height;
        }

        return data;
      }
    };

    const handleSelectAsset = async () =>
      sdk.dialogs.selectSingleAsset().then((asset: any) => getAssetData(asset));

    const handleCreateAsset = async () =>
      sdk.navigator
        .openNewAsset({ slideIn: { waitForClose: true } })
        .then(({ entity }: any) => getAssetData(entity));

    const handleEditAsset = async (id: string) =>
      await sdk.navigator
        .openAsset(id, { slideIn: { waitForClose: true } })
        .then(({ entity }: any) => getAssetData(entity));

    const defaults: any = {
      height: 500,
      menubar,
      plugins,
      toolbar,
      image_caption: true,
      custom_colors: customcolors,
      toolbar_groups: {},
      quickbars_selection_toolbar: quickbarsSelectionToolbar,
      quickbars_insert_toolbar: false,
      content_style: customContentStyle,
      setup: (editor: any) => setupEditor(editor),
    };

    if (custompalette) {
      defaults.color_map = colormap;
    }

    if (formatgroup) {
      defaults.toolbar_groups.formatgroup = {
        icon: "format",
        tooltip: "Formatting",
        items: formatgroup,
      };
    }

    if (assetgroup) {
      defaults.toolbar_groups.assetgroup = {
        icon: "gallery",
        tooltip: "Contentful Assets",
        items: assetgroup,
      };
    }

    if (insertgroup) {
      defaults.toolbar_groups.insertgroup = {
        icon: "plus",
        tooltip: "Insert",
        items: insertgroup,
      };
    }

    if (extragroup) {
      defaults.toolbar_groups.extragroup = {
        icon: "more-drawer",
        tooltip: "More",
        items: extragroup,
      };
    }

    setInit(defaults);
  }, [sdk]);

  const handleEditorChange = (newValue: string) => {
    if (debounceInterval) {
      clearInterval(debounceInterval);
    }

    debounceInterval = setTimeout(() => {
      sdk.field.setValue(newValue);
    }, 500);
  };

  return init ? (
    <Editor
      value={value}
      apiKey={apiKey}
      init={init}
      onEditorChange={handleEditorChange}
    />
  ) : (
    <div>
      Loading editor <Spinner />
    </div>
  );
};

export default Field;
