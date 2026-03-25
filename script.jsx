class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <h2 className="header-text">{this.props.header}</h2>
        <button className="header-btn" onClick={this.props.onBtnClick}>
          {this.props.isExtended ? (
            <i className="fa-solid fa-xmark" data-comp={this.props.comp}></i>
          ) : (
            <i className="fa-solid fa-maximize" data-comp={this.props.comp}></i>
          )}
        </button>
      </div>
    );
  }
}

class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const html = {
      __html: this.props.text,
    };
    return (
      <div className="wrapper preview-wrapper">
        <Header header="Previewer" {...this.props} comp="preview" />
        <div
          id="preview"
          className="preview"
          dangerouslySetInnerHTML={html}
        ></div>
      </div>
    );
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper editor-wrapper">
        <Header header="Editor" {...this.props} comp="editor" />
        <textarea
          id="editor"
          className="editor-input"
          value={this.props.input}
          onChange={(e) => this.props.onInputChange(e)}
        ></textarea>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      extended: {
        editor: false,
        preview: false,
      },
    };
    this.changeInput = this.changeInput.bind(this);
    this.toggleExtended = this.toggleExtended.bind(this);
  }

  changeInput(e) {
    this.setState((prev) => {
      return {
        ...prev,
        input: e.target.value,
      };
    });
  }

  toggleExtended(e) {
    this.setState((prev) => {
      return {
        ...prev,
        extended: {
          ...prev.extended,
          [e.target.dataset.comp]: !prev.extended[e.target.dataset.comp],
        },
      };
    });
  }

  componentDidMount() {
    const initialMarkdown = `
# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;
    const renderer = new marked.Renderer();
    renderer.code = function ({ text, lang }) {
      if (!lang || lang === "js") lang = "javascript";
      return `<pre><code class="language-${lang}">${text}</code></pre>`;
    };

    marked.setOptions({
      breaks: true,
      renderer,
    });

    Prism.highlightAll();

    this.setState((prev) => {
      return {
        ...prev,
        input: initialMarkdown,
      };
    });
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  render() {
    const parsedHTML = DOMPurify.sanitize(marked.parse(this.state.input));

    return (
      <div className="container">
        {!this.state.extended.preview && (
          <Editor
            input={this.state.input}
            onInputChange={this.changeInput}
            isExtended={this.state.extended.editor}
            onBtnClick={(e) => {
              this.toggleExtended(e);
            }}
          />
        )}
        {!this.state.extended.editor && (
          <Preview
            text={parsedHTML}
            isExtended={this.state.extended.preview}
            onBtnClick={(e) => {
              this.toggleExtended(e);
            }}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
