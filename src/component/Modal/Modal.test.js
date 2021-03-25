import Modal from './index.js'
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({ adapter: new Adapter() });
const selectionsArr = [
	{
		id: 4949131405,
		name: "Lunch Ride",
		time: "2021-03-14T12:27:38Z",
		url: "https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:o}lnEvf|qU|ChJrB[{@n@vAgAlDjAPWuAfLw@pMeF|WmBhOw@tA}DfUApF~@r[yAnFXhNuCrADhIaA|CsUhOwGvF}GtH}EbDiGuN_EkHnLxX{WvXaXjWy@xAuRjSkAt@cKlCsJvKkBbDj@rDbBtBo@`BqDnFsVrYcDfFiJdLyZr^uDpGgGtNu@pDq@nAFXQO`AkCMi@mCOeAs@mJyKiRcT}CoByDiAgXcGkG{Dko@q|@kCqEmCqH{IvJgA{@cFeB}N{BmD`@gClAgC`@oEGqCmAqB~BaGP}BlBwRmC{Oo@yGdEkDrFkB`AiIlAwAQiCsAgCFkAx@sA|DqCzEyAlFoDbEcQ`IoCAiEiAuBNgBtAaClFaKzD_HS_Jx@eD[mGl@uB{@wG_@oCmAiDa@sNrCaHiAmDDwBkAcCU{Ht@{HdBuFTmN{EwJeBcE_BoFwF}IyCyF~@cG~BkCNaDdFmHr@iDfBgBE}Cn@q@v@_@nCs@jBcDpFwA^aCvBsDjAgB?}LnFyBvFdDeG|LkFxAHxCu@xE}DjE{Hn@aEbA}@vFBvDiBrH{@h@_@xBiE~BElGcCdG{@xI`DtCzDnAv@n_@jLrIk@bDgAhKmAvBXdClAlDFnHhAdOuDfIzBtERjCv@fIYxBf@`JkAbGNnKoD|CcHpBwAr@C^^VbEf@r@rCe@rC`@`DwArChAxEkCnCe@tB\zFgFz@?h@x@D[Kd@yBbAgAdBaDdCyBd@tBSbDmC\Th@`CaAhDy@X_BU_Ad@qBhDm@zCqAxBeAb@aD@}CrAoEIwCm@cNpIqE`@cBdB}DkCjDbDiAdBcGk@zC|@fAC|@_@dCqDrGgAxMoIzAIvG|@|CkAxEUrAyCb@sCfBwCbAu@~BRhA_AP_Dm@aCnAwB~B}@jFi@n@w@LgC~BmBfCHfGkAxC|AfAu@`@u@JyAs@yFFsEn@qCfAuA`Bk@jBHp@r@HlE`@v@~Ah@nBq@hAiC[cBmAeCLgDpUfC~CkBxEOfBeCzCrA`EH`GqBzC[vJz@nJnC`BhA`IuIzCxJjp@b~@bDhDzFvCzVnFdGvBp`@`c@|B~@bBY`MyWnCgEz\ya@tDoDbs@}{@tF_IjBwAvKmBrJsKpEkBlXcWoAuCIt@F{AqBwCe@gB|RmRBiBkCeHcGgM_@[Tj@R^g@y@W_BoJeUoIuRkLaWwHqRrULe@_Nu[mJ{S}D{Eg@}Atd@o[`IqGxJeGpK}ElWy\eC}F~FaI}F~@&key=AIzaSyBgqwajgRIEaLQ92J7ahUndHvd7NJYIDPY"
	},
	{
		id: 4949131406,
		name: "Lunch Ride",
		time: "2021-03-14T12:27:38Z",
		url: "https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:o}lnEvf|qU|ChJrB[{@n@vAgAlDjAPWuAfLw@pMeF|WmBhOw@tA}DfUApF~@r[yAnFXhNuCrADhIaA|CsUhOwGvF}GtH}EbDiGuN_EkHnLxX{WvXaXjWy@xAuRjSkAt@cKlCsJvKkBbDj@rDbBtBo@`BqDnFsVrYcDfFiJdLyZr^uDpGgGtNu@pDq@nAFXQO`AkCMi@mCOeAs@mJyKiRcT}CoByDiAgXcGkG{Dko@q|@kCqEmCqH{IvJgA{@cFeB}N{BmD`@gClAgC`@oEGqCmAqB~BaGP}BlBwRmC{Oo@yGdEkDrFkB`AiIlAwAQiCsAgCFkAx@sA|DqCzEyAlFoDbEcQ`IoCAiEiAuBNgBtAaClFaKzD_HS_Jx@eD[mGl@uB{@wG_@oCmAiDa@sNrCaHiAmDDwBkAcCU{Ht@{HdBuFTmN{EwJeBcE_BoFwF}IyCyF~@cG~BkCNaDdFmHr@iDfBgBE}Cn@q@v@_@nCs@jBcDpFwA^aCvBsDjAgB?}LnFyBvFdDeG|LkFxAHxCu@xE}DjE{Hn@aEbA}@vFBvDiBrH{@h@_@xBiE~BElGcCdG{@xI`DtCzDnAv@n_@jLrIk@bDgAhKmAvBXdClAlDFnHhAdOuDfIzBtERjCv@fIYxBf@`JkAbGNnKoD|CcHpBwAr@C^^VbEf@r@rCe@rC`@`DwArChAxEkCnCe@tB\zFgFz@?h@x@D[Kd@yBbAgAdBaDdCyBd@tBSbDmC\Th@`CaAhDy@X_BU_Ad@qBhDm@zCqAxBeAb@aD@}CrAoEIwCm@cNpIqE`@cBdB}DkCjDbDiAdBcGk@zC|@fAC|@_@dCqDrGgAxMoIzAIvG|@|CkAxEUrAyCb@sCfBwCbAu@~BRhA_AP_Dm@aCnAwB~B}@jFi@n@w@LgC~BmBfCHfGkAxC|AfAu@`@u@JyAs@yFFsEn@qCfAuA`Bk@jBHp@r@HlE`@v@~Ah@nBq@hAiC[cBmAeCLgDpUfC~CkBxEOfBeCzCrA`EH`GqBzC[vJz@nJnC`BhA`IuIzCxJjp@b~@bDhDzFvCzVnFdGvBp`@`c@|B~@bBY`MyWnCgEz\ya@tDoDbs@}{@tF_IjBwAvKmBrJsKpEkBlXcWoAuCIt@F{AqBwCe@gB|RmRBiBkCeHcGgM_@[Tj@R^g@y@W_BoJeUoIuRkLaWwHqRrULe@_Nu[mJ{S}D{Eg@}Atd@o[`IqGxJeGpK}ElWy\eC}F~FaI}F~@&key=AIzaSyBgqwajgRIEaLQ92J7ahUndHvd7NJYIDPY"
	},
	{
		id: 4949131407,
		name: "Lunch Ride",
		time: "2021-03-14T12:27:38Z",
		url: "https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:o}lnEvf|qU|ChJrB[{@n@vAgAlDjAPWuAfLw@pMeF|WmBhOw@tA}DfUApF~@r[yAnFXhNuCrADhIaA|CsUhOwGvF}GtH}EbDiGuN_EkHnLxX{WvXaXjWy@xAuRjSkAt@cKlCsJvKkBbDj@rDbBtBo@`BqDnFsVrYcDfFiJdLyZr^uDpGgGtNu@pDq@nAFXQO`AkCMi@mCOeAs@mJyKiRcT}CoByDiAgXcGkG{Dko@q|@kCqEmCqH{IvJgA{@cFeB}N{BmD`@gClAgC`@oEGqCmAqB~BaGP}BlBwRmC{Oo@yGdEkDrFkB`AiIlAwAQiCsAgCFkAx@sA|DqCzEyAlFoDbEcQ`IoCAiEiAuBNgBtAaClFaKzD_HS_Jx@eD[mGl@uB{@wG_@oCmAiDa@sNrCaHiAmDDwBkAcCU{Ht@{HdBuFTmN{EwJeBcE_BoFwF}IyCyF~@cG~BkCNaDdFmHr@iDfBgBE}Cn@q@v@_@nCs@jBcDpFwA^aCvBsDjAgB?}LnFyBvFdDeG|LkFxAHxCu@xE}DjE{Hn@aEbA}@vFBvDiBrH{@h@_@xBiE~BElGcCdG{@xI`DtCzDnAv@n_@jLrIk@bDgAhKmAvBXdClAlDFnHhAdOuDfIzBtERjCv@fIYxBf@`JkAbGNnKoD|CcHpBwAr@C^^VbEf@r@rCe@rC`@`DwArChAxEkCnCe@tB\zFgFz@?h@x@D[Kd@yBbAgAdBaDdCyBd@tBSbDmC\Th@`CaAhDy@X_BU_Ad@qBhDm@zCqAxBeAb@aD@}CrAoEIwCm@cNpIqE`@cBdB}DkCjDbDiAdBcGk@zC|@fAC|@_@dCqDrGgAxMoIzAIvG|@|CkAxEUrAyCb@sCfBwCbAu@~BRhA_AP_Dm@aCnAwB~B}@jFi@n@w@LgC~BmBfCHfGkAxC|AfAu@`@u@JyAs@yFFsEn@qCfAuA`Bk@jBHp@r@HlE`@v@~Ah@nBq@hAiC[cBmAeCLgDpUfC~CkBxEOfBeCzCrA`EH`GqBzC[vJz@nJnC`BhA`IuIzCxJjp@b~@bDhDzFvCzVnFdGvBp`@`c@|B~@bBY`MyWnCgEz\ya@tDoDbs@}{@tF_IjBwAvKmBrJsKpEkBlXcWoAuCIt@F{AqBwCe@gB|RmRBiBkCeHcGgM_@[Tj@R^g@y@W_BoJeUoIuRkLaWwHqRrULe@_Nu[mJ{S}D{Eg@}Atd@o[`IqGxJeGpK}ElWy\eC}F~FaI}F~@&key=AIzaSyBgqwajgRIEaLQ92J7ahUndHvd7NJYIDPY"
	}
]

it('Open modal and check for close button', () => {
	const wrapper = Enzyme.mount(<Modal show={true} selections={selectionsArr}></Modal>);
	const list1 = wrapper.find('.toggle-button')
	expect(list1).toBeTruthy()
});

it('Open modal click list view and check for list elements', () => {
	const wrapper = Enzyme.mount(<Modal show={true} selections={selectionsArr}></Modal>);
	const listButton = wrapper.find('.list-modal')
	listButton.simulate('click')
	const listNodes = wrapper.find('.list-conainer-favorites')
	expect(listNodes).toBeTruthy()
})

it('Open modal click detail view and check for tile elements', () => {
	const wrapper = Enzyme.mount(<Modal show={true} selections={selectionsArr}></Modal>);
	const detailButton = wrapper.find('.detail-modal')
	detailButton.simulate('click')
	const tileNodes = wrapper.find('.tile-container-favorites')
	expect(tileNodes).toBeTruthy()
})