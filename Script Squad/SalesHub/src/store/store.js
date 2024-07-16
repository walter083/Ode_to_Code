import { create } from 'zustand'

const useStore = create((set) => ({
    dropdown: '',
    addToDropDown : (item) => set({dropdown:item}),
}))

export default useStore;