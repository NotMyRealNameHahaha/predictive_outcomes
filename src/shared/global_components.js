import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import './styles.scss'
import Vue_ from 'vue'
import {
    MdApp,
    MdAvatar,
    MdButton,    
    MdCard,
    MdCheckbox,
    MdContent,
    MdDatepicker,
    MdDialog,
    MdDivider,
    MdDrawer,
    MdEmptyState,
    MdField,
    MdIcon,
    MdList,
    MdMenu,
    MdProgress,
    MdRadio,
    MdRipple,
    MdSpeedDial,
    MdSubheader,
    MdTable,
    MdTabs,
    MdToolbar,
    MdTooltip
} from 'vue-material/dist/components'


export const Vue = Vue_

const mdComponents = [
    MdApp,
    MdAvatar,
    MdButton,    
    MdCard,
    MdCheckbox,
    MdContent,
    MdDatepicker,
    MdDialog,
    MdDivider,
    MdDrawer,
    MdEmptyState,
    MdField,
    MdIcon,
    MdList,
    MdMenu,
    MdProgress,
    MdRadio,
    MdRipple,
    MdSpeedDial,
    MdSubheader,
    MdTable,
    MdTabs,
    MdToolbar,
    MdTooltip
]


mdComponents.forEach(comp => Vue.use(comp))


export default Vue