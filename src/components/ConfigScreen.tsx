import React, { Component, ChangeEvent } from "react";
import { AppExtensionSDK } from "contentful-ui-extensions-sdk";
import {
  Heading,
  Form,
  Workbench,
  Paragraph,
  TextField,
  Switch,
  ValidationMessage,
  FormLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  HelpText,
} from "@contentful/forma-36-react-components";
import { css } from "emotion";

import {
  AppInstallationParameters,
  colormap,
  defaultParameters,
} from "./ConfigDefaults";

type ParameterKeys = keyof AppInstallationParameters;

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = { parameters: defaultParameters };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    if (parameters && !parameters?.colormap) {
      parameters.colormap = colormap;
    }

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Validate colors.
    const errors = this.state.parameters.colormap.filter((color, idx) => {
      if (idx % 2 === 0) {
        return !this.validateHexColor(color) ? true : false;
      } else {
        return false;
      }
    });

    // Validate that apiKey is present.
    if (!this.state.parameters.apiKey) {
      errors.push("apiKey");
    }

    if (errors.length) {
      this.props.sdk.notifier.error(
        "Please fix all validation errors before saving"
      );

      return false;
    }

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await this.props.sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  };

  validateHexColor = (color: string): boolean =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

  onInputChange = (event: ChangeEvent): void => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    const newParams: any = { ...this.state.parameters };
    newParams[name as ParameterKeys] = value;

    this.setState({
      parameters: newParams,
    });
  };

  onSwitchChange = (name: string, isChecked: boolean): void => {
    const newParams: any = { ...this.state.parameters };
    newParams[name as ParameterKeys] = isChecked;

    this.setState({
      parameters: newParams,
    });
  };

  onColorChange = (event: ChangeEvent, idx: number): void => {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    const newParams: any = { ...this.state.parameters };
    newParams.colormap[idx] = value;
    this.setState({
      parameters: newParams,
    });
  };

  onColorLabelChange = (event: ChangeEvent, idx: number): void => {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    const newParams: any = { ...this.state.parameters };
    newParams.colormap[idx] = value;
    this.setState({
      parameters: newParams,
    });
  };

  render() {
    return (
      <Workbench className={css({ margin: "80px" })}>
        <Form>
          <Heading>TinyMCE Editor</Heading>
          <Paragraph>
            This App provides the TinyMCE editor as an alternative to use a
            WYSIWYG editor in Contentful.
          </Paragraph>
          <TextField
            name="apiKey"
            id="apiKey"
            labelText="TinyMCE API Key"
            required
            value={this.state.parameters.apiKey}
            onChange={this.onInputChange}
            textLinkProps={{
              icon: "ExternalLink",
              text: "Get a tinyMCE API key",
              onClick: () =>
                window.open("https://www.tiny.cloud/my-account/dashboard"),
            }}
          />
          <Paragraph style={{ marginTop: "2em" }}>
            The below defaults can be changed, check tiny documentation for all
            available options:
          </Paragraph>
          <TextField
            name="plugins"
            id="plugins"
            labelText="Plugins"
            required
            value={this.state.parameters.plugins}
            onChange={this.onInputChange}
            textLinkProps={{
              icon: "ExternalLink",
              text: "Plugins",
              onClick: () =>
                window.open("https://www.tiny.cloud/docs/plugins/"),
            }}
          />

          <TextField
            name="toolbar"
            id="toolbar"
            labelText="Toolbar"
            required
            value={this.state.parameters.toolbar}
            helpText="Use '|' as a toolbar divider. There are 4 toolbar groups: 'formatgroup', 'assetgroup', 'insertgroup' and 'extragroup'."
            onChange={this.onInputChange}
            textLinkProps={{
              icon: "ExternalLink",
              text: "Toolbar buttons",
              onClick: () =>
                window.open(
                  "https://www.tiny.cloud/docs/advanced/available-toolbar-buttons/"
                ),
            }}
          />

          {this.state.parameters.plugins.includes("quickbars") ? (
            <TextField
              name="quickbarsSelectionToolbar"
              id="quickbarsSelectionToolbar"
              labelText="Quickbars Selection Toolbar"
              value={this.state.parameters.quickbarsSelectionToolbar}
              onChange={this.onInputChange}
              textLinkProps={{
                icon: "ExternalLink",
                text: "Quickbars documentation",
                onClick: () =>
                  window.open("https://www.tiny.cloud/docs/plugins/quickbars/"),
              }}
            />
          ) : null}

          <TextField
            name="formatgroup"
            id="formatgroup"
            labelText="Toolbar Format Group"
            helpText="Referenced using key 'formatgroup' in the toolbar field"
            value={this.state.parameters.formatgroup}
            onChange={this.onInputChange}
          />

          <TextField
            name="assetgroup"
            id="assetgroup"
            labelText="Toolbar Asset Group"
            helpText="Handles Contentful assets using `existingasset` for inserting an existing Asset or `newasset` for creating a new Asset. Referenced using key 'assetgroup' in the toolbar field."
            value={this.state.parameters.assetgroup}
            onChange={this.onInputChange}
          />

          <TextField
            name="insertgroup"
            id="insertgroup"
            labelText="Toolbar Insert Group"
            helpText="Referenced using key 'insertgroup' in the toolbar field"
            value={this.state.parameters.insertgroup}
            onChange={this.onInputChange}
          />

          <TextField
            name="extragroup"
            id="extragroup"
            labelText="Toolbar Extra Group"
            helpText="Referenced using key 'extragroup' in the toolbar field"
            value={this.state.parameters.extragroup}
            onChange={this.onInputChange}
          />

          <Switch
            id="menubar"
            isChecked={this.state.parameters.menubar}
            labelText="Show the menubar"
            onToggle={(isChecked) => this.onSwitchChange("menubar", isChecked)}
          />

          <TextField
            name="resizing"
            id="resizing"
            labelText="Resizing behaviour for Contentful media assets"
            helpText="Set an optional resizing behaviour to all images inserted from Contentful"
            value={this.state.parameters.resizing}
            onChange={this.onInputChange}
            textLinkProps={{
              icon: "ExternalLink",
              text: "Contentful images api resizing documentation",
              onClick: () =>
                window.open(
                  "https://www.contentful.com/developers/docs/references/images-api/#/reference/resizing-&-cropping"
                ),
            }}
          />

          <TextField
            name="customContentStyle"
            id="customContentStyle"
            textarea
            labelText="Custom Content Styling"
            helpText="Override default editor styles."
            value={this.state.parameters.customContentStyle}
            onChange={this.onInputChange}
            textInputProps={{ rows: 10 }}
            textLinkProps={{
              icon: "ExternalLink",
              text: "TinyMCE content_style documentation",
              onClick: () =>
                window.open(
                  "https://www.tiny.cloud/docs/configure/content-appearance/#exampleapplyingonecssstyleusingcontent_style"
                ),
            }}
          />

          <Switch
            id="customcolors"
            isChecked={this.state.parameters.customcolors}
            labelText="Show Custom Colors Palette Picker"
            onToggle={(isChecked) =>
              this.onSwitchChange("customcolors", isChecked)
            }
          />

          <Switch
            id="custompalette"
            isChecked={this.state.parameters.custompalette}
            labelText="Customize default TinyMCE color palette"
            onToggle={(isChecked) =>
              this.onSwitchChange("custompalette", isChecked)
            }
          />

          {this.state.parameters.custompalette ? (
            <>
              <FormLabel htmlFor="colormap">Default color palette</FormLabel>
              <Table className="colormap">
                <TableHead>
                  <TableRow>
                    <TableCell>Color Value</TableCell>
                    <TableCell>Color Label</TableCell>
                    <TableCell style={{ minWidth: "200px" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.parameters.colormap.map((color, idx) => {
                    if (idx % 2 !== 0) {
                      return null;
                    }
                    return (
                      <TableRow key={`color-${idx}`}>
                        <TableCell
                          style={{
                            backgroundColor: this.state.parameters.colormap[
                              idx
                            ],
                          }}
                        >
                          <TextField
                            name={`color-${idx}`}
                            id={`color-${idx}`}
                            value={this.state.parameters.colormap[idx]}
                            onChange={(e) => this.onColorChange(e, idx)}
                            labelText=""
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: this.state.parameters.colormap[
                              idx
                            ],
                          }}
                        >
                          <TextField
                            name={`color-label-${idx}`}
                            id={`color-label-${idx}`}
                            value={this.state.parameters.colormap[idx + 1]}
                            onChange={(e) =>
                              this.onColorLabelChange(e, idx + 1)
                            }
                            labelText=""
                          />
                        </TableCell>
                        <TableCell>
                          {!this.validateHexColor(
                            this.state.parameters.colormap[idx]
                          ) ? (
                            <ValidationMessage>
                              Invalid Hex Color value
                            </ValidationMessage>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <HelpText>
                Only used if keywords <em>forecolor</em> or <em>backcolor</em>{" "}
                are defined in the toolbar).
              </HelpText>
            </>
          ) : null}
        </Form>
      </Workbench>
    );
  }
}
