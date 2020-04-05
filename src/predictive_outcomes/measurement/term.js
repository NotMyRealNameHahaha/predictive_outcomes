import nlp from 'compromise'

export const Term = text => {
    const chain = ()=> nlp(text)
    return {
        chain,
        text,
        isPlural: ()=> chain().nouns().isPlural().data().length > 0,
        isSingular: ()=> chain().nouns().isPlural().data().length < 0,
        toSingular: ()=> chain().nouns().toSingular().all().text(),
        toPlural: ()=> chain().nouns().toPlural().all().text()
    }
}

export default Term
