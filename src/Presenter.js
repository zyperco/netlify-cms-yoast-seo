import { helpers } from 'yoastseo'
import isObject from 'lodash/isObject'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'

export default class Presenter {

    getScoresAsHTML(h, data) {
        return h('div', { className: 'yoast' },
            h('h3', { className: 'yoast__heading' }, 'SEO'),
            h('ul', { className: 'yoast__items' },
                this.getScoreItemsAsHTML(h, data.seo, 'seo')
            ),
            h('h3', { className: 'yoast__heading' }, 'Content'),
            h('ul', { className: 'yoast__items yoast__items--bottom' },
                this.getScoreItemsAsHTML(h, data.content, 'content')
            )
        )
    }

    getScoreItemsAsHTML(h, items, datatype) {
        return items.map((item, index) => this.getScoreItemAsHTML(h, item, index, datatype))
    }

    getScoreItemAsHTML(h, item, index, datatype) {
        return h(
          'li',
          {
            className: `yoast__item yoast__item--${item.rating}`,
            key: `${datatype}-${index}`
          },
          item.text.replace(/<(?:.|\n)*?>/gm, '')
        )
    }

    getScores(assessor) {
        const scores = []

        forEach (this.getScoresWithRatings(assessor), (item, key) =>
            scores.push(this.addRating(item))
        )

        return scores
    }

    addRating(item) {
        return {
            rating: item.rating,
            text: item.text,
            identifier: item.getIdentifier()
        }
    }

    getScoresWithRatings(assessor) {
        const scores = assessor.getValidResults().map(r => {
            if (!isObject(r) || !r.getIdentifier()) {
                return ``;
            }
            r.rating = helpers.scoreToRating(r.score)
            return r
        })

        return filter(scores, r => r !== ``);
    }

}
