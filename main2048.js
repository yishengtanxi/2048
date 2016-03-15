var board = new Array();
var score = 0;
var hasConflicted=new Array();
var startx=0,
    starty=0,
    endx=0,
    endy=0;
$(document).ready(function(){
    prepareForMobile();
    newgame();
});
function prepareForMobile(){
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('header p').css('font-size',0.04*documentHeight);
    $("header h1").css('font-size',0.05*documentHeight);
    $("#newgamebutton").css('margin-top',0.02*documentHeight);
    $("#grid-container").css("width",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("height",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("margin-top",0.06*documentHeight);
    $("#grid-container").css("border-radius",0.02*gridContainerWidth);
    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02*cellSideLength);

}

function newgame(){
    score=0;
    updateScore(score);
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();

}

function init(){
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }
    }
    for (var i = 0; i < 4; i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();

}
function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<img class="number-cell" id="number-cell-'+i+'-'+j+'"></img>');
            var theNumberCell=$("#number-cell-"+i+"-"+j);
            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.attr('src','images/'+board[i][j]+'.png')
                // theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                // theNumberCell.css('color',getNumberColor(board[i][j]));
                // theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
    $(".number-cell").css("line-height",cellSideLength+"px");
    $(".number-cell").css("font-size",0.6*cellSideLength+"px");
}
function generateOneNumber(){
    if(nospace(board)){
        return false;
    }
    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var times=0;
    while(times<50){
        if(board[randx][randy]==0){
            break;
        }else{
            var randx=parseInt(Math.floor(Math.random()*4));
            var randy=parseInt(Math.floor(Math.random()*4));
            times++;
        }
    }
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }
    //随机一个数字
    var randNumber=Math.random() > 0.5 ? 2:4;
    //在随机位置上显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}
$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left
        event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39://right
        event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300); 
            }
            break;
        case 40://down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300); 
            }
            break;
        default:
            break;                  
    }
});
document.addEventListener('touchstart',function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});
document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    var deltax=endx-startx,
        deltay=endy-starty;
    if(Math.abs(deltax)<0.2*documentWidth&&Math.abs(deltay)<0.2*documentWidth){
        return;
    }
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }else{
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }else if(deltay>0){
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300); 
            }
    }else{
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300); 
            } 
    }
})
function isgameover(){
    if(nospace(board)&&nomove(board)){
        gameover();
    }
}
function gameover(){
    alert("gameover!");
}
function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }else{
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if(board[i][j]!=0){
                    for(var k=0;k<j;k++){
                        if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&& !hasConflicted[i][k]){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]+=board[i][j];
                            board[i][j]=0;
                            score+=board[i][k];
                            updateScore(score);
                            hasConflicted[i][k]=true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }else{
        for(var i=0;i<4;i++){
            for(var j=2;j>=0;j--){
                if(board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]+=board[i][j];
                            score+=board[i][k];
                            updateScore(score);
                            board[i][j]=0;
                            hasConflicted[i][k]=true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }else{
        for(var j=0;j<4;j++){
            for(var i=1;i<4;i++){
                if(board[i][j]!=0){
                    for(var k=0;k<i;k++){
                        if(board[k][j]==0&&noBlockVertical( j , k , i , board )){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }else if(board[k][j]==board[i][j]&&noBlockVertical( j , k , i , board )&& !hasConflicted[k][j]){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            score+=board[k][j];
                            updateScore(score);
                            hasConflicted[k][j]=true;
                            continue;
                        }
                    }
                }
            }
        }

    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveDown(){
    //var hasConflicted=false;
    if(!canMoveDown(board)){
        return false;
    }else{
        for(var j=0;j<4;j++){
            for(var i=2;i>=0;i--){
                if(board[i][j]!=0){
                    for(var k=3;k>i;k--){
                        if(board[k][j]==0&&noBlockVertical( j , i , k , board )){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }else if(board[k][j]==board[i][j]&&noBlockVertical( j , i , k , board )&& !hasConflicted[k][j]){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            score+=board[k][j];
                            updateScore(score);
                            hasConflicted[k][j]=true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}