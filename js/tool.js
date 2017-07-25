
//通过指定id获取到对应的数据
function getItemById(data, id){
  //debugger;
  var current = null;
  for(var i=0;i<data.length;i++){
    //看数据第一层是否含有要查找的的数据，如果有则返回要查的数据
    if(data[i].id === id){
      current = data[i];
      break;
    }

    //如果当前的数据存在，并且data[i]存在孩子节点，则递归函数getItemById(data[i].children, id)
    if(!current && data[i].children){
      current = getItemById(data[i].children,id);
      if(current){
        break;
      }
    }
  }
  return current;
}
//-----------------------------------------------------------------
//获取到一组数据data中指定的id的所有数据
function getChildrenById(data,id){
  var current = getItemById(data,id);
  return current.children;
}

//-------------------------------------------------------------------
//通过指定的id获取到自己以及自己所有的父级
function getParentsById(data,id){
  var parents = [];
  var current = getItemById(data,id);
  if(current){
    parents.push(current);
    parents = parents.concat(getParentsById(data,current.pId))
  }
  return parents;
}
//----------------------------------------------------------------------
//获取元素身上 data-id 里面的id，并转换成数字类型
function getDataSetId(obj){
  return obj.dataset.id*1;
}
//----------------------------------------------------------------------
//判断文件夹名字是否可用
function nameCanUse(data,name){
  for(var i=0;i<data.length;i++){
    if(data[i].name === name){
      return false;
    }
  }
  return true;
}
//----------------------------------------------------------------------
//声明一个函数并返回这个最大id
function maxId(data){
  return data.maxId = data.maxId + 1;
}
//-------------------------------------------------------------------------
//获取被选中的数据函数
function isCheckedFile(data){
  var arr = [];
  for(var i=0;i<data.length;i++){
    if(data[i].checked){
      arr.push(data[i])
    }
  }
  return arr;
}
//-------------------------------------------------------------------------
//根据数据查找对应的节点
function getChildNode(parentNode,id){
  var children = parentNode.children;
  for(var i=0;i<children.length;i++){
    if(getDataSetId(children[i]) === id){
      return children[i];
    }
  }
  return null;
}
//------------------------------------------------------------------
//生成移动文件结构
function createMoveListMenuHtml(data, id){
  var html = createTreeHtml(data, id);
  var moveListMenu = document.querySelector('.move-list-menu');
  moveListMenu.innerHTML = html;
}

//------------------------------------------------------------------
// 重名替换数据
function replaceSameNameData(data, replaceData){
  for(var i=0; i<data.length; i++){
    if(data[i].name === replaceData.name){
      replaceData.pId = data[i].pId;
      replaceData.checked = false;
      data[i] = replaceData;
      data[i].name = data[i].name + '(新)';
      break;
    }
  }
}

//-------------------------------------------------------------
//判断是否全选
function isCheckedAll(data){
  for(var i=0;i<data.length;i++){
    if(!data[i].checked){
      return false;
    }
  }
  return true;
}
//------------------------------------------------------------------
//判断一个文件夹是否有孩子节点
function isHaveChildNode(data,id){
  var dataArr =  getItemById(data, id);
  if(dataArr.children.length <= 0){
    return true;
  }else{
    return false;
  }
}
//-------------------------------------------------------------------------------