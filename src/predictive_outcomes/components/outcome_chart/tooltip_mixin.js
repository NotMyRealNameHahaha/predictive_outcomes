import { createPopper } from '@popperjs/core'


export const TooltipMixin = {
    data() {
        return {
            tooltipData: null,
            popper: null,
            popperIsActive: false
        }
    },

    methods: {
        initPopper() {
            this.destroyPopper()
            const chart = this.$el.querySelector('.outcome-chart')
            const ref = chart.querySelector('.active-line')
            const tooltip = this.$el.querySelector('.tooltip')
            this.popper = createPopper(ref, tooltip, {
                placement: 'right',
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            preventOverflow: {
                                boundariesElement: chart
                            }
                        }
                    }
                ]
            })
        },

        destroyPopper() {
            try {
                this.popper.destroy()
                this.popper = null
            } catch(err) {}
        },

        _onMouseMove(params) {
            if (this.popper) {
                const tooltipData = params || null
                this.popperIsActive = !!params
                this.tooltipData = tooltipData
                this.popper.update()
            }
        }
    },

    beforeDestroy() {
        this.destroyPopper()
    }
}

export default TooltipMixin