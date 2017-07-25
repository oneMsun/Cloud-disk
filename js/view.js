
var data  = user_data.files;

//声明文件夹父容器
var dataFlieBox = document.querySelector('.dataFlieBox');

//声明导航路径父容器
var pathContent = document.querySelector('.path-content');

//声明返回上一级按钮
var backPrev = document.querySelector('.backPrev');

//声明新建文件夹按钮
var createFileBtn = document.querySelector('.create-file');

//声明删除文件夹按钮
var deleteFileBtn = document.querySelector('.delete-file');

//声明重命名文件夹按钮
var renameFilesBtn = document.querySelector('.rename-file');

//声明移动文件夹按钮
var moveFileBtn = document.querySelector('.move-file');

//声明移动目标弹出层外容器
var moveListWrap = document.querySelector('.move-list-wrap');

//声明移动目标弹出层外容器
var reDoint = document.querySelector('.reDoint');

//声明全选按钮
var checkBoxBtn = document.querySelector('.checkBox');

//声明显示文件夹个数信息
var pathText = document.querySelector('.path-text');

//声明全选文字信息
var checkBoxText = document.querySelector('.checkBoxText');

//当前层级，初始化为根目录为0
var current = 0;

//声明一个对象存储当前层级的所有子节点数据
var currentData = null;

// 初始化结构
currentData = view(data,current);
showText(currentData);
//---------------------------------------------------------------------------------------------------
//创建树形菜单结构
function createTreeHtml(data, id){
  var str = `<ul>`;
  for(var i=0; i<data.length; i++){
    if(data[i].checked) continue;
    str += `<li class="clear">
              <h2 class="${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}">
                <span class="add ${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}"></span>
                <i class="add ${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}"></i>
                ${data[i].name}
              </h2>`;
    // 判断当前数据是否有子数据
    str += data[i].children ? createTreeHtml(data[i].children, id) : '';
    str += `</li>`;
  }
  str += `</ul>`;
  return str;
}
//---------------------------------------------------------------------------------------------------

//创建文件夹结构
function createFilesHtml(data,id){
	var str = '';
	var len = data.length;
	for(var i=0;i<len;i++){
		 str+=`<div class="file" data-id ="${data[i].id}">
               <div class="checkbox"></div>
               <div class="file-img" data-id ="${data[i].id}"></div>
               <div class="file-name" >
               		<span class="file-show-name" title="${data[i].name}" data-id ="${data[i].id}">${data[i].name}</span>
               		<input type="text" class="file-change-name" data-id ="${data[i].id}">
               </div>
               </div>`;
	}
	return str;
}
// 生成所有的文件
function viewFiles(data,id){
	var filesData = getChildrenById(data,id);
	var html = createFilesHtml(filesData,id);
	dataFlieBox.innerHTML = html;
	return filesData;
}

//创建面包屑路径导航
function createNavHtml(data,id){
	var str = '';
	for(var i= data.length-1;i>=0;i--){
		str += `<span class="${i === 0 ? 'mb' : ''}" data-id ="${data[i].id}">${data[i].name}</span>` + ' / ';
	}
	return str.substr(0,str.length-2);
}

//生成文件导航
function viewNavs(data,id){
	var parents = getParentsById(data,id);
	var html = createNavHtml(parents,id);
	pathContent.innerHTML = html;
	return parents;
}

//导航路径和文件夹渲染函数
function view(data,id){
	viewNavs(data,id);
	return viewFiles(data,id);
}

//---------------------------------------------------------------------------------------------------
//点击文件夹
dataFlieBox.addEventListener('click',function(e){

	var ev = e.target;
	//点击进入文件夹
	if(ev.classList.contains('file') || ev.classList.contains('file-img')){
		inintChecked();
		var id= getDataSetId(ev);
		currentData = view(data, current = id);
		showText(currentData);

		if(current !== 0){
			backPrev.style.display = 'block';
		}else{
			backPrev.style.display = '';
		}
		if(isHaveChildNode(data,current)){
			noChlidContent();
			checkBoxText.style.display = 'none';
			checkBoxBtn.style.display = 'none';

		}
	}
	//重命名文件夹
	if(ev.classList.contains('file-show-name')){
		rename(ev,getDataSetId(ev));
	}
	//点击选中文件
	if(ev.classList.contains('checkbox')){
		checkedItem(ev.parentNode);
	}
});
//-------------------------------------------------------------------------------------------------
//点击返回上一级按钮返回上一级文件夹
backPrev.addEventListener('click',function(){
	inintChecked();
	if(current >= 0){
		current = getItemById(data,current).pId;
		if(current === 0){
			currentData = view(data, current);
			showText(currentData);
			current = 0;
			backPrev.style.display = 'none';
			return;
		}
		currentData = view(data, current);
		showText(currentData);
	}
	if(!isHaveChildNode(data,current)){
			checkBoxText.style.display = 'block';
			checkBoxBtn.style.display = 'block';

	}
});
//---------------------------------------------------------------------------------------------------
//创建文件夹节点并返回新建的文件夹节点
function createFileNode(){
	//创建文件夹外层div
	var file = document.createElement('div');
	file.className = 'file';

	//创建选中div
	var checkbox = document.createElement('div');
	checkbox.className = 'checkbox';

	//创建文件夹图标
	var fileImg = document.createElement('div');
	fileImg.className = 'file-img';

	//创建文件夹名称外层div节点
	var fileName = document.createElement('div');
	fileName.className = 'file-name';

	//创建显示文件夹名称的节点
	var fileShowName = document.createElement('span');
	fileShowName.className = 'file-show-name';
	fileShowName.innerHTML = fileShowName.title = '';

	//创建文件命名输入框节点
	var fileChangeName = document.createElement('input');
	fileChangeName.className = 'file-change-name';
	fileChangeName.type = 'text';

	fileName.appendChild(fileShowName);
	fileName.appendChild(fileChangeName);
	file.appendChild(checkbox);
	file.appendChild(fileImg);
	file.appendChild(fileName);
	return file;
}
/**
 * 创建文件夹流程为先创建文件夹节点，并把这个节点放在所有文件夹的最前面，
 * 然后对文件夹进行重命名操作，重命名规则要排除命名的文件名称是否是空格，然后点击文档或者，
 * 通过回车键来命名文件名称，最后一个把创建的文件夹的数据添加数据中去，以此来完成文件夹的创建过程。
 *
 */
//点击新建文件夹按钮创建文件夹
createFileBtn.addEventListener('click',function(){
	if(isHaveChildNode(data,current)){
		dataFlieBox.innerHTML = '';
	}
	inintChecked();
	createFolder();//创建文件夹函数


});

//声明一个创建文件夹的函数
function createFolder(){
	var newFolderNode = createFileNode();
	dataFlieBox.insertBefore(newFolderNode,dataFlieBox.firstElementChild);
	renameFile(newFolderNode,data);
}
//新建重命名函数
function renameFile(fileNode,data){
	var fileShow = fileNode.querySelector('.file-show-name');
	var fileinput = fileNode.querySelector('.file-change-name');
	fileShow.style.display = 'none';
	fileinput.style.display = 'block';
	fileinput.focus();
	fileinput.onblur = function(){
		var val = this.value.trim();
		if(val === ''){
			fileNode.parentNode.removeChild(fileNode);
			alert('文件夹创建失败')
			noChlidContent();
		}else{
			if(nameCanUse(currentData,val)){
				var filesData = {
					name : val,
					id: maxId(user_data),
					pId :current,
					children : []
				};
				currentData.unshift(filesData);
				currentData = view(data,current);
				showText(currentData);
				alert('文件夹创建成功');
			}else{
				alert('文件名称重复');
			}
		}
	}
	//回车键确定重命函数
	window.onkeydown = function(e){
		if(e.keyCode === 13 && fileinput.value !== ''){
			fileinput.blur();
		}
	}
}
//-----------------------------------------------------------------------------------------------
/**
 * 删除文件夹操作：首先要选中文件夹，声明一个自定义属性checke，如果选中则返回true，否则为false，
 * 然后把是true的数据放在一个数组中，当点击删除按钮的时候，然后把是true的选中数据从当前数据中删除，
 * 并渲染页面
 */
//选中文件夹函数
function checkedItem(obj){
	var checked = false;
	obj.classList.toggle('active');
	if(obj.classList.contains('active')){
		checked = true;
	}
	var evData = getItemById(currentData, getDataSetId(obj));
	evData.checked = checked;
	if(isCheckedAll(currentData)){
		checkBoxBtn.classList.add('active');
	}else{
		checkBoxBtn.classList.remove('active');
	}
}


//点击按钮删除文件夹操作
deleteFileBtn.addEventListener('click',function(){
	var checkedArr = isCheckedFile(currentData);
	if(checkedArr.length){
		var isDelete = confirm('确定要删除么');
		if(!isDelete)return;
		delectCheckedData(currentData);
		currentData = view(data,current);
		showText(currentData);
		alert('删除成功');
		inintChecked();
		// if(isHaveChildNode(data,current)){
		// 	noChlidContent();
		// }
	}else{
		alert('请选择要删除的内容');
	}
})
//删除当前选中的数据并返回这个删除后的数据
function delectCheckedData(data){
	for(var i=0;i<data.length;i++){
		if(data[i].checked){
			data.splice(i,1);
			i--;
		}
	}
	return data;
}

//-------------------------------------------------------------------------------
/**
 * 文件夹重命名：分为两种命名方式：
 * 1.选中文件，然后点击重命名按钮对文件夹进行命名
 * 2.点击文件名称对文件夹进行命名。
 */
//点击命名文件夹按钮对选中的文件夹进行命名操作
renameFilesBtn.addEventListener('click',function(){
	var checkedItem = isCheckedFile(currentData);
	if(!checkedItem.length){
		alert('请选择要命名的文件夹');
	}
	if(checkedItem.length > 1){
		alert('请选择一个文件进行命名');
	}
	if(checkedItem.length === 1){
		var reNameChild = getChildNode(dataFlieBox,checkedItem[0].id);
		var showName = reNameChild.querySelector('.file-show-name');
		console.log(showName);
		rename(showName,getDataSetId(showName));
	}
});

/**
 *声明一个重命名函数
 *这个函数用来执行点击重命名按钮所进行的重命的操作
 *这个函数也是用来执行点击文件名称所进行的重命名的操作
 */
//要调用的重命的函数
function rename(ele,id){
	var nextSibling = ele.nextElementSibling;
	ele.style.display = 'none';
	nextSibling.style.display = 'block';
	nextSibling.value = ele.title;
	nextSibling.select();
	nextSibling.onblur = function(){
		var val = this.value.trim();
		if(val === '' || val === ele.title){
			nextSibling.style.display = 'none';
			ele.style.display = 'block';
			alert('取消重命名');
		}else{
			//debugger;
			if(nameCanUse(currentData,val)){
				var currentItem = getItemById(currentData,id);
				console.log(val);
				currentItem.name = val;
				ele.title = ele.innerHTML = val;
				nextSibling.style.display = 'none';
				ele.style.display = 'block';
				alert('重命名成功');
			}else{
				alert('文件名称与现有的文件名称冲突');
				this.select();
			}
		}
	};
	window.onkeydown = function(e){
		if(e.keyCode === 13){
			alert(1);
			nextSibling.blur();
		}
	}
}
//------------------------------------------------------------------------------------------
/**
 *移动文件夹功能：首先需要选中要移动的文件夹，然后点击移动按钮，随后弹出要移动的位置文件夹页面，
 *然后选中移动到的目标区域，然后点击确定按钮完成移动，随后渲染当前数据。
 */
//点击移动按钮触发移动事件
moveFileBtn.addEventListener('click',function(){
	var isCheckedItems = isCheckedFile(currentData);
  // 如果层级只有一个文件夹
  if((currentData.length <= 1 && getParentsById(data, current).length < 2) || (current === 0 && currentData.length === isCheckedItems.length)){
    alert('没有可移动到的目标目录！');
    inintChecked();
    return;
  }
  // 如果没有选中的数据
  if(!isCheckedItems.length){
    alert('请选择要移动的内容！');
    return;
  }
  // 创建可以移动的列表
  createMoveListMenuHtml(data, current)
  // 让移动遮罩层显示出来
  moveListWrap.classList.add('active');
  moveItemsFn(data);

})

//声明移动弹出层函数
function moveItemsFn(data){
  // 获取当前弹出的头部
  var moveListHeader = moveListWrap.querySelector('.move-list-header');
  // 关闭x按钮
  var closeMoveList = moveListWrap.querySelector('.move-list-header span');
  // 树状菜单
  var moveListMenu = moveListWrap.querySelector('.move-list-menu');
  // 确定
  var moveSure = moveListWrap.querySelector('.move-list-wrap .sure');
  // 取消
  var moveCancel = moveListWrap.querySelector('.move-list-wrap .cancel');

  // 当前要移动到的目录，一开始默认显示当前这一层
  var currentMove = current;

  // 拖拽弹窗
  //dragElement(moveListHeader, moveListHeader.parentNode, true);

  // 点击对应菜单，切换对应class
  moveListMenu.onclick = function (e){
    var target = e.target;
    if(target.nodeName === 'H2' || target.classList.contains('add')){
      currentMove = getDataSetId(target);
      createMoveListMenuHtml(data, currentMove);
    }
  };
  // 确定按钮
  moveSure.onclick = function (){
    // 如果要移动的目标目录的id和当前的相等那么证明要移动到
    // 的是当前这一层目录
    if(current === currentMove){
      alert('不能移动到同一级目录!');
      return;
    }
    // 找到要移动到的目标目录的所有的子数据
    var targetMoveData = getChildrenById(data, currentMove);
    // 关闭弹窗
    moveListWrap.classList.remove('active');

    moveItemsData(targetMoveData, currentMove);

    if(currentData.length === 0){
      //initChecked();
    }
    currentData = view(data, current);
    alert('移动完成!');
    clearEvent();
  };
  // 取消按钮和关闭窗口
  moveCancel.onclick = closeMoveList.onclick = function (){
    moveListWrap.classList.remove('active');
    clearEvent();
  };
  // 清除事件，释放内存
  function clearEvent(){
    moveListMenu.onclick = moveSure.onclick = null;
    moveCancel.onclick = closeMoveList.onclick = null;
    moveListHeader.onmousedown = null;
  }
}
//移动数据
function moveItemsData(moveTargetData, targetId){
  for(var i=0; i<currentData.length; i++){
    if(currentData[i].checked){
      if(!nameCanUse(moveTargetData, currentData[i].name)){
        let repeatMessage = confirm('有相同名字文件是否覆盖?');
        if(repeatMessage){
          // 把当前这一层级相同的名字的数据替换掉
          replaceSameNameData(moveTargetData, currentData[i]);
          currentData.splice(i, 1);
          i--;
          continue;
        }
        let confirmMessage = confirm('是否保留两者?');
        if(!confirmMessage) continue;
        currentData[i].name = currentData[i].name + '(副本)';
      }
      // 修改自身的pId为目标目录的id
      currentData[i].pId = targetId;
      currentData[i].checked = false;
      moveTargetData.push(currentData.splice(i, 1)[0]);
      i--;
    }
  }
}

//----------------------------------------------------------------------
//全选功能
checkBoxBtn.addEventListener('click',function(){
	this.classList.toggle('active');
	for(var i=0;i<currentData.length;i++){
		if(this.classList.contains('active')){
			currentData[i].checked = true;
			dataFlieBox.children[i].classList.add('active');
		}else{
			currentData[i].checked = false;
			dataFlieBox.children[i].classList.remove('active');
		}
	}
})
//取消全选功能
function inintChecked(){
	checkBoxBtn.classList.remove('active');
	for(var i=0;i<currentData.length;i++){
		currentData[i].checked = false;
		dataFlieBox.children[i].classList.remove('active');
	}
}
//-----------------------------------------------------------------------
//显示当前页面共有多少个文件夹
function showText(data){
	var len = data.length;
	pathText.innerHTML = `当前显示文件夹数为:${len}个`;
}
//-----------------------------------------------------------------------
//刷新文档页面
reDoint.addEventListener('click',function(){
	location.reload();
});
//------------------------------------------------------------------------
//当文件夹没有孩子节点要显示的内容
function noChlidContent(){
	var bgimg = document.createElement('img');
	bgimg.src = 'images/noContentImg.png';
	bgimg.className = 'noContentImg';
	var text = document.createElement('span');
	text.className = 'no-content-text';
	text.innerHTML = ' 亲 ，这个文件夹是空的';
	//dataFlieBox.innerHTML = '';
	dataFlieBox.appendChild(bgimg);
	dataFlieBox.appendChild(text);
}
//------------------------------------------------------------------------
