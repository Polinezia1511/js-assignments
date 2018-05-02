'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                         *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Возвращает объект Прямоугольник (rectangle) с параметрами высота (height) и ширина (width)
 * и методом getArea(), который возвращает площадь
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function(){
    return this.width * this.height;
}


/**
 * Возвращает JSON представление объекта
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Возвращает объект указанного типа из представления JSON
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let obj = JSON.parse(json);
    obj.__proto__ = proto;
    return obj;
}


/**
 * Создатель css селекторов
 *
 * Каждый комплексый селектор может состоять из эелемента, id, класса, атрибута, псевдо-класса и
 * псевдо-элемента
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Может быть несколько вхождений
 *
 * Любые варианты селекторов могут быть скомбинированы с помощью ' ','+','~','>' .
 *
 * Задача состоит в том, чтобы создать отдельный класс, независимые классы или
 * иерархию классов и реализовать функциональность
 * для создания селекторов css с использованием предоставленного cssSelectorBuilder.
 * Каждый селектор должен иметь метод stringify ()
 * для вывода строкового представления в соответствии с спецификацией css.
 *
 * Созданный cssSelectorBuilder должен использоваться как фасад
 * только для создания ваших собственных классов,
 * например, первый метод cssSelectorBuilder может быть таким:
 *
 * Дизайн класса(ов) полностью зависит от вас,
 * но постарайтесь сделать его максимально простым, понятным и читаемым насколько это возможно.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  Если нужно больше примеров - можете посмотреть юнит тесты.
 */

const cssSelectorBuilder = {

    stringify: function() { 
        return (this.combineValue || '') + 
        (this.elementValue || '') + 
        (this.idValue || '') + 
        (this.classValue || '') + 
        (this.attrValue || '') + 
        (this.pseudoClassValue || '') + 
        (this.pseudoElementValue || '') ; 
    }, 
    
    orderChekc: function (obj, prop) { 
        let orderArray = [obj.elementValue, obj.idValue, obj.classValue, obj.attrValue, obj.pseudoClassValue, obj.pseudoElementValue]; 
        orderArray.forEach((item, i) => { 
        if(item && i > orderArray.indexOf(prop)) 
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); 
        }); 
    }, 
    element: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        if(obj.elementValue) 
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); 
        else 
            obj.elementValue = value; 
        this.orderChekc(obj, obj.elementValue); 
        return obj; 
    },

    id: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        if(obj.idValue) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); 
        }else {
            obj.idValue = '#' + value; 
        }
            
        this.orderChekc(obj, obj.idValue); 
        return obj; 
    },

    class: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        obj.classValue = (obj.classValue || '') + '.' + value; 
        this.orderChekc(obj, obj.classValue); 
        return obj; 
    },

    attr: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        obj.attrValue = (obj.attrValue || '') + '[' + value + ']'; 
        this.orderChekc(obj, obj.attrValue); 
        return obj; 
    },

    pseudoClass: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        obj.pseudoClassValue = (obj.pseudoClassValue || '') + ':' + value; 
        this.orderChekc(obj, obj.pseudoClassValue); 
        return obj;
    },

    pseudoElement: function(value) {
        let obj = {}; 
        obj.__proto__ = this; 
        if(obj.pseudoElementValue) 
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); 
        else 
            obj.pseudoElementValue = '::' + value; 
        this.orderChekc(obj, obj.pseudoElementValue); 
        return obj;
    },

    combine: function(selector1, combinator, selector2) {
       let obj = {}; 
        obj.__proto__ = this; 
        obj.combineValue = (obj.combineValue || '') + selector1.stringify() + ' ' + combinator + ' ' + selector2.stringify(); 
        return obj;
    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
