/**
 * Created by JetBrains WebStorm.
 * User: user
 * Date: 11/12/11
 * Time: 14:39
 * To change this template use File | Settings | File Templates.
 */

var OtherUtils = {};

OtherUtils.dumpJson = function(v, opts){
 var _opts={ksort:false, indent:false, funcsrc:false, undefined2str:false, maxDepth:10};
 for(var k in opts) _opts[k]=opts[k];
 var d=parseInt(_opts.maxDepth);
 _opts.maxDepth=(d>0)?(d<100)?d:100:1;

 var f1=(!!_opts.indent)?function(d){
  for(var s='\n', i=0; i<=d; i++) s+='  ';
  return s
 }:function(){ return ''; };

 var f2ps=[[/\\/g,"\\\\"],[/\n/g,"\\n"],[/\r/g ,"\\r"],[/\t/g,"\\t"],[/(")/g,"\\$1"]];
 var f2=function(v){
  for(var i=0;i<f2ps.length;i++) v=v.replace.apply(v,f2ps[i]);
  return v;
 }

 var fn=function(v,d){
  if(d>=_opts.maxDepth) throw 'depth '+_opts.maxDepth+' orver error.';
  if(null===v) return 'null';
  switch(typeof v){
   case 'undefined': return (!!_opts.undefined2str)?'"undefined"':'null';
   case 'boolean': return v?'true':'false';
   case 'function': v=(!!_opts.funcsrc)?v.toSource():'function()';
   case 'string': return '"'+f2(v)+'"';
   case 'object':
    var s=[];
    if(v instanceof Array){
     for(var i=0; i<v.length; i++) s.push(fn(v[i],d+1));
     return '['+f1(d)+s.join(','+f1(d))+f1(d-1)+']';
    }
    var ks=[];
    for(var k in v) ks.push(k);
    if(!!_opts.ksort) ks.sort();
    for(var i=0; i<ks.length; i++) s.push(fn(ks[i],d+1)+':'+fn(v[ks[i]],d+1));
    return '{'+f1(d)+s.join(','+f1(d))+f1(d-1)+'}';
  }
  return v;
 }
 return fn(v,0);
};

OtherUtils.unique = function(array) {
    var storage = {};
    var uniqueArray = [];

    var i, value;
    for (i = 0; i < array.length; i++) {
        value = array[i];
        if (!(value in storage)) {
            storage[value] = true;
            uniqueArray.push(value);
        }
    }

    return uniqueArray;
}
