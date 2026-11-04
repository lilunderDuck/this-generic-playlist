import { css } from "molcss"
import { Input, type IDialogContentProps } from "../../ui"
import { scrollbar, scrollbar__vertical } from "../../../utils"
import CreatePlaylistDialogSection from "./CreatePlaylistDialogSection"
import { BsPlus } from "solid-icons/bs"

const dialog__root = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--crust);
  width: 45rem;
  height: 80vh;
  user-select: none;
  font-size: 1.2rem;
  & label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
`

const dialog__basicInfoSection = css`
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

const dialog__iconInputSection = css`
  margin-bottom: 15px;
`

const dialog__iconInputContainer = css`
  display: flex;
  width: 100%;
  gap: 10px;
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

export default function CreatePlaylistDialog(props: IDialogContentProps) {
  return (
    <div class={`${dialog__root} ${scrollbar} ${scrollbar__vertical}`}>
      <h1>Create playlist</h1>
      <CreatePlaylistDialogSection name$="Cover icon and banner" class={dialog__iconInputSection}>
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
      <CreatePlaylistDialogSection name$="Basic info" class={dialog__basicInfoSection}>
        <div class={dialog__inputPart}>
          <label>Name</label>
          <Input placeholder="Playlist name" />
        </div>

        <div class={dialog__inputPart}>
          <label>Author</label>
          <Input placeholder="Playlist author(s)" />
        </div>

        <div class={dialog__inputPart}>
          <label>Description</label>
          <textarea placeholder="Playlist author(s)" class={dialog__textarea} />
        </div>
      </CreatePlaylistDialogSection>
    </div>
  )
}