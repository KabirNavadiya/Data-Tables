function nonRepeating(str){
let freq = [...str].reduce((a,b)=>{
    a[b] = (a[b] || 0) +1;
    return a;
},{})

for(let x in freq){
   if(freq[x]==1){
    return x;
   }
   else{
    return "no such char exist"
   }
}

}
let ans =nonRepeating("aaaa");
console.log(ans);
console.log([]+[]);
