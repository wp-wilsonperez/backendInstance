class FirstExercise {    
    constructor(a,b,k){
        this.a = a ;
        this.b = b;
        this.k = k;
        
    }
    rangeNumber(){
        let result = [];
        for(let i = this.a;i < this.b; i++){
            i%this.k == 0?result.push(i):null;
        }
        return result.length;
    }
}

let first = new FirstExercise(1,10,2);
console.log(first.rangeNumber());
