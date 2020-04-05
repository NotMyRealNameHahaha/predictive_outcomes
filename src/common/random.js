export const randomNumberBetween = (min, max)=> 
    Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)


export const randomIntBetween = (min, max)=> randomNumberBetween(min, max) | 0


export const randomItemFrom = items=>
    items[Math.floor( Math.random() * items.length )]

