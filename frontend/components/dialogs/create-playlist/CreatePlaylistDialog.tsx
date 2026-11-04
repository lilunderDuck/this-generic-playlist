import { css } from "molcss"
import { Button, ButtonSize, ButtonVariant, Input, type IDialogContentProps } from "../../ui"
import { scrollbar, scrollbar__vertical } from "../../../utils"
import CreatePlaylistDialogSection from "./CreatePlaylistDialogSection"
import { BsPlus } from "solid-icons/bs"
import { PlaylistAuthorInput } from "./PlaylistAuthorInput"

const dialog__root = css`
  padding-inline: 20px;
  padding-block: 12px;
  background-color: var(--crust);
  width: 45rem;
  height: 80vh;
  user-select: none;
  font-size: 1.2rem;
  & label {
    display: block;
  }

  & label, & [data-label] {
    font-weight: bold;
    margin-bottom: 5px;
  }
`

const dialog__heading = css`
  margin-bottom: 10px;
`

const dialog__inputPart = css`
  padding-inline: 10px;
  padding-block: 5px;
  margin-bottom: 10px;
`

const dialog__textarea = css`
  resize: none;
  width: 100%;
  background-color: var(--base);
  padding-inline: 10px;
  padding-block: 5px;
`

const dialog__iconInputContainer = css`
  display: flex;
  width: 100%;
  gap: 15px;
  padding-inline: 10px;
`

const dialog__imageInput = css`
  background-color: var(--base);
  border-radius: 6px;
  outline: 4px dashed transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    outline-color: var(--sapphire);
  }
`

const dialog__iconInput = css`
  width: 13rem;
  height: 13rem;
`

const dialog__bannerWrapper = css`
  flex: 1;
`

const dialog__bannerInput = css`
  width: 100%;
  height: 13rem;
  flex-shrink: 0;
`

const dialog__buttonRow = css`
  padding-inline: 20px;
  padding-right: 15px;
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`

export default function CreatePlaylistDialog(props: IDialogContentProps) {
  return (
    <div class={`${dialog__root} ${scrollbar} ${scrollbar__vertical}`}>
      <h1 class={dialog__heading}>Create playlist</h1>
      <CreatePlaylistDialogSection name$="Cover icon and banner">
        <div class={dialog__iconInputContainer}>
          <div>
            <label>Playlist icon</label>
            <div class={`${dialog__imageInput} ${dialog__iconInput}`}>
              <BsPlus size={30} />
            </div>
          </div>
          <div class={dialog__bannerWrapper}>
            <label>Playlist banner</label>
            <div class={`${dialog__imageInput} ${dialog__bannerInput}`}>
              <BsPlus size={30} />
            </div>
          </div>
        </div>
      </CreatePlaylistDialogSection>
      <CreatePlaylistDialogSection name$="Basic info">
        <div class={dialog__inputPart}>
          <div data-label>Name</div>
          <Input autocomplete="off" id="name" placeholder="Playlist name" />
        </div>

        <div class={dialog__inputPart}>
          <div data-label>Author</div>
          <PlaylistAuthorInput />
        </div>

        <div class={dialog__inputPart}>
          <label for="description">Description</label>
          <textarea 
            id="description" 
            rows={8}
            placeholder="A brief description of this playlist..." 
            class={dialog__textarea} 
          />
        </div>
      </CreatePlaylistDialogSection>
      <div class={dialog__buttonRow}>
        <Button size$={ButtonSize.LARGE} variant$={ButtonVariant.DANGER} onClick={props.close$}>
          Discard
        </Button>
        <Button size$={ButtonSize.LARGE} variant$={ButtonVariant.SECONDARY}>
          Create
        </Button>
      </div>
    </div>
  )
}