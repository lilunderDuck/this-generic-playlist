import { Accessor, createSignal, Setter } from "solid-js"

interface IPagingHandlerOptions {
  maxAmountOfElement$: number
  pagingAmount$: number
}

export function createPagingHandler<Data extends any>(options: IPagingHandlerOptions) {
  const [currentItemIndex, setCurrentItemIndex] = createSignal(0)
  const [currentItem, setCurrentItem] = createSignal(null)

  let currentPage = 0
  let currentItemInPageIndex = 0
  let pageElement = []

  return {
    async toNextItem$() {
      if (currentItemIndex() == options.maxAmountOfElement$) return

      setCurrentItemIndex(prev => prev + 1)
      setCurrentItem(pageElement[currentItemInPageIndex])
    },
    async toPreviousItem$() {
      if (currentItemIndex() == 0) return

      setCurrentItemIndex(prev => prev - 1)
    }
  }
}