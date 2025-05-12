import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
// import { cartActions } from "../features/cart/cartSlice"
// import { currencyActions } from "../features/currencies/currencySlice"

const actions = {
    // ...cartActions,
    // ...currencyActions,
}

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}