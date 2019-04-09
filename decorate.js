function isAnimal(target) { 
	console.log(arguments)
    target.isAnimal = true
    return target // 返回的是传递给该函数的对象
}
function inject(){
	console.log(arguments);
	return function(){
		console.log(arguments);
	};
}
@inject(1)
@isAnimal
class Cat {
    // ...
}
console.log(Cat.isAnimal) // t



// 在新版的nodejs下，直接使用es6语法的方法
// 把原来的 *.js改为*.mjs
// 需要增加node运行参数 --experimental-modules