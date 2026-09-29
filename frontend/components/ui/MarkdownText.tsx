import Markdown from "solid-marked/component";

export function MarkdownText(props: { children?: string }) {
  return (
    <Markdown builtins={{
      Root: props => <div>{props.children}</div>,
      Blockquote: props => <blockquote>{props.children}</blockquote>,
      Paragraph: props => <p>{props.children}</p>,
      Link: props => <a href={props.url} target="_blank">{props.children ?? props.url}</a>
    }}>
      {props.children ?? ''}
    </Markdown>
  )
}