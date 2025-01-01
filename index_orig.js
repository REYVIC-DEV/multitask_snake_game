const body = document.querySelector('body');
const snake_head = document.getElementById('snake_head');
const body_container = document.getElementById('body_container');
const snake_body = document.getElementsByClassName('snake_body');
const food = document.getElementsByClassName('food');

const start_container = document.getElementById('start_container');
const start_btn = document.getElementById('start_btn');

var body_height = body.getBoundingClientRect().height;
var body_width = body.getBoundingClientRect().width;

var game_start = false;


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// snake movement
var add_inc = 2;
function moveX(object, inc){
    var pos = object.getBoundingClientRect().left;
    inc = add_inc*inc; 
    object.style.left = String(pos + inc) + 'px';
}
function moveY(object, inc){
    var pos = object.getBoundingClientRect().top;
    inc = add_inc*inc; 
    object.style.top = String(pos + inc) + 'px';
}

var key_pressed = {'w':false, 's':false, 'a':false, 'd':false}

var manual = false;
var key_on = false;

body.addEventListener('keydown', (e)=>{
    if(String(e.key).toLowerCase() == 'w' && key_pressed.s != true && key_on){
        key_pressed.w = true;
        if(manual == false){
            key_pressed.s = false;
            key_pressed.a = false;
            key_pressed.d = false;
        }
        snake_head.style.rotate = '180deg'
    }
    if(String(e.key).toLowerCase() == 's' && key_pressed.w != true && key_on){
        key_pressed.s = true;
        if(manual == false){
            key_pressed.w = false;
            key_pressed.a = false;
            key_pressed.d = false;
        }
        snake_head.style.rotate = '0deg'
    }
    if(String(e.key).toLowerCase() == 'a' && key_pressed.d != true && key_on){
        key_pressed.a = true;
        if(manual == false){
            key_pressed.w = false;
            key_pressed.s = false;
            key_pressed.d = false;
        }
        snake_head.style.rotate = '90deg'
    }
    if(String(e.key).toLowerCase() == 'd' && key_pressed.a != true && key_on){
        key_pressed.d = true;
        if(manual == false){
            key_pressed.w = false;
            key_pressed.s = false;
            key_pressed.a = false;
        }
        snake_head.style.rotate = '-90deg'
    }
});
body.addEventListener('keyup', (e)=>{
    if(manual){
        if(String(e.key).toLowerCase() == 'w'){
            key_pressed.w = false;
        }
        if(String(e.key).toLowerCase() == 's'){
            key_pressed.s = false;
        }
        if(String(e.key).toLowerCase() == 'a'){
            key_pressed.a = false;
        }
        if(String(e.key).toLowerCase() == 'd'){
            key_pressed.d = false;
        }
    }

});

// snake position/body
var head_bottom = snake_head.getBoundingClientRect().bottom;
var head_right = snake_head.getBoundingClientRect().right;
var head_top = snake_head.getBoundingClientRect().top;
var head_left = snake_head.getBoundingClientRect().left;
var curr_head_top = 0;
var curr_head_left = 0;
var curr_head_right = 0;
var curr_head_bottom = 0;

var body_top = [];
var body_left = [];
var body_bottom = [];
var body_right = [];
var curr_body_top = [];
var curr_body_left = [];
var body_inc = 30;

// food
var spawned = [];
var food_top = [];
var food_left = [];
var food_bottom = [];
var food_right = [];
var food_size = [];
var food_count = 0;

var invincible = false;
var bite_power = 30;

function game_over(){
    key_on = false;
    key_pressed.w = false;
    key_pressed.s = false;
    key_pressed.a = false;
    key_pressed.d = false;
    snake_head.classList.add('invincible');
    for (let i = 0; i < snake_body.length; i++) {
        snake_body[i].classList.add('invincible');
    }
    body_container.innerHTML = 'GAME OVER';
    setTimeout(() => {
        snake_head.classList.remove('invincible');
        for (let i = 0; i < snake_body.length; i++) {
            snake_body[i].classList.remove('invincible');
        }
        body_container.innerHTML = '';
        game_start = false
    }, 1000);
}

function eat_larger_food(i){
    if(food_size[i]  > 30 && snake_body.length > 0 && invincible == false){
        body_container.removeChild(snake_body[snake_body.length-1]);
        body_top.pop();
        body_left.pop();
        body_bottom.pop();
        body_right.pop();
        curr_body_top.pop();
        curr_body_left.pop();
        
        food_size[i]-=bite_power;
        if(food_size[i] < 30){
            food_size[i] = 30;
        }
        food[i].innerHTML = food_size[i];
        food[i].style.height = String(food_size[i]) + 'px';
        food[i].style.width = String(food_size[i]) + 'px';
        food_top[i] = food[i].getBoundingClientRect().top;
        food_left[i] = food[i].getBoundingClientRect().left;
        food_bottom[i] = food[i].getBoundingClientRect().bottom;
        food_right[i] = food[i].getBoundingClientRect().right;
    }
    else{
        if(invincible == false){
            game_over();
        }
    }
}
var over = [];
var hover_timer = [];
for (let i = 0; i < food.length; i++) {
    food[i].addEventListener('mouseover',()=>{
        over[i] = true;
        hover_timer[i] = setInterval(() => {
            if(food_size[i]  > 30 && over[i]){
                food_size[i]-=10;
                food[i].innerHTML = food_size[i];
                food[i].style.height = String(food_size[i]) + 'px';
                food[i].style.width = String(food_size[i]) + 'px';
                food_top[i] = food[i].getBoundingClientRect().top;
                food_left[i] = food[i].getBoundingClientRect().left;
                food_bottom[i] = food[i].getBoundingClientRect().bottom;
                food_right[i] = food[i].getBoundingClientRect().right;
            }
        }, 500);
    });
}
var click_timer = [];
for (let i = 0; i < food.length; i++) {
    food[i].addEventListener('click',()=>{
        clearInterval(click_timer[i]);
        click_timer[i] = setInterval(() => {
            if(food_size[i]  > 30){
                food_size[i]-=10;
                food[i].innerHTML = food_size[i];
                food[i].style.height = String(food_size[i]) + 'px';
                food[i].style.width = String(food_size[i]) + 'px';
                food_top[i] = food[i].getBoundingClientRect().top;
                food_left[i] = food[i].getBoundingClientRect().left;
                food_bottom[i] = food[i].getBoundingClientRect().bottom;
                food_right[i] = food[i].getBoundingClientRect().right;
            }
            if(food_size[i] <= 30){
                clearInterval(click_timer[i]);
            }
        }, 500);
    });
}
for (let i = 0; i < food.length; i++) {
    food[i].addEventListener('mouseout',()=>{
        over[i] = false;
        clearInterval(hover_timer[i]);
    });
}

var invincible_timer = '';
function spawn_food(){
    for (let i = 0; i < food.length; i++) {
        if(!(spawned[i])){
            if(snake_body.length < 12){
                invincible = true;
                clearInterval(invincible_timer);
                snake_head.classList.add('invincible');
                for (let i = 0; i < snake_body.length; i++) {
                    snake_body[i].classList.add('invincible');
                }
                invincible_timer = setTimeout(() => {
                    invincible = false;
                    snake_head.classList.remove('invincible');
                    for (let i = 0; i < snake_body.length; i++) {
                        snake_body[i].classList.remove('invincible');
                    }
                }, 1000);
            }
            var food_multiplier = getRandomInt(5);
            if (food_multiplier > 0) {
                if (i<3) {
                    food_multiplier = 1;
                }
                food_size[i] = 30 * food_multiplier;
                food[i].style.height = String(food_size[i]) + 'px'; 
                food[i].style.width = String(food_size[i]) + 'px';
                food[i].innerHTML = String(food_size[i]);
                food[i].style.top = String(getRandomInt(body_height - food_size[i])) + 'px';
                food[i].style.left = String(getRandomInt(body_width - food_size[i])) + 'px';
                food_top[i] = food[i].getBoundingClientRect().top;
                food_left[i] = food[i].getBoundingClientRect().left;
                food_bottom[i] = food[i].getBoundingClientRect().bottom;
                food_right[i] = food[i].getBoundingClientRect().right;
                spawned[i] = true;
            }
        }
    }
}

//body add
function add_body(){
    var div = document.createElement('div');
    div.className = 'snake_body';
    body_container.append(div);
}

// start game
start_btn.addEventListener('click', ()=>{
    snake_head.style.top = String(getRandomInt(body_height - 50)) + 'px';
    snake_head.style.left = String(getRandomInt(body_width - 50)) + 'px';
    head_bottom = snake_head.getBoundingClientRect().bottom;
    head_right = snake_head.getBoundingClientRect().right;
    head_top = snake_head.getBoundingClientRect().top;
    head_left = snake_head.getBoundingClientRect().left;
    curr_head_top = 0;
    curr_head_left = 0;
    curr_head_right = 0;
    curr_head_bottom = 0;
    
    body_top = [];
    body_left = [];
    body_bottom = [];
    body_right = [];
    curr_body_top = [];
    curr_body_left = [];

    spawned = [];
    food_top = [];
    food_left = [];
    food_bottom = [];
    food_right = [];
    food_size = [];

    
    bite_power = 30;
    snake_head.style.rotate = '0deg'
    spawn_food();

    key_on = true;
    game_start = true;
});

// timer
const b_length = document.getElementById('length');
const bite = document.getElementById('bite');
setInterval(() => {
    body_height = body.getBoundingClientRect().height;
    body_width = body.getBoundingClientRect().width;
    if(game_start){
        if(snake_body.length == bite_power){
            body_container.innerHTML = '';
            bite_power += 1;
            body_top = [];
            body_left = [];
            body_bottom = [];
            body_right = [];
            curr_body_top = [];
            curr_body_left = [];
        }
        b_length.innerHTML = snake_body.length;
        bite.innerHTML = bite_power;
        for(let i = 0; i < food.length; i++){
            food[i].style.visibility = 'visible';
        }
        snake_head.style.visibility = 'visible';
        start_container.style.visibility = 'hidden';
        for (let i = 0; i < food.length; i++) {        
            if(!(spawned[i])){
                spawn_food();
            }
        }
        for (let i = 0; i < snake_body.length; i++) {
            snake_body[i].style.zIndex = -i;
        }
        if(key_pressed.w && curr_head_top > 0){
            moveY(snake_head,-1);
            if(head_top == curr_head_top+body_inc){
                head_top = snake_head.getBoundingClientRect().top;
                head_left = snake_head.getBoundingClientRect().left;
                for (let i = 0; i < snake_body.length; i++) {
                        body_top[i] = snake_body[i].getBoundingClientRect().top;
                        body_left[i] = snake_body[i].getBoundingClientRect().left;
                        body_right[i] = snake_body[i].getBoundingClientRect().right;
                        body_bottom[i] = snake_body[i].getBoundingClientRect().bottom;
                }
            }
        }
        if(key_pressed.s && curr_head_bottom < body_height){
            moveY(snake_head,1);
            if(head_top == curr_head_top-body_inc){
                head_top = snake_head.getBoundingClientRect().top;
                head_left = snake_head.getBoundingClientRect().left;
                for (let i = 0; i < snake_body.length; i++) {
                        body_top[i] = snake_body[i].getBoundingClientRect().top;
                        body_left[i] = snake_body[i].getBoundingClientRect().left;
                        body_right[i] = snake_body[i].getBoundingClientRect().right;
                        body_bottom[i] = snake_body[i].getBoundingClientRect().bottom;
                }
            }
        }
        if(key_pressed.a && curr_head_left > 0){
            moveX(snake_head,-1);
            if(head_left == curr_head_left+body_inc){
                head_left = snake_head.getBoundingClientRect().left;
                head_top = snake_head.getBoundingClientRect().top;
                for (let i = 0; i < snake_body.length; i++) {
                        body_top[i] = snake_body[i].getBoundingClientRect().top;
                        body_left[i] = snake_body[i].getBoundingClientRect().left;
                        body_right[i] = snake_body[i].getBoundingClientRect().right;
                        body_bottom[i] = snake_body[i].getBoundingClientRect().bottom;
                }
            }
        }
        if(key_pressed.d && curr_head_right < body_width){
            moveX(snake_head,1);
            if(head_left == curr_head_left-body_inc){
                head_left = snake_head.getBoundingClientRect().left;
                head_top = snake_head.getBoundingClientRect().top;
                for (let i = 0; i < snake_body.length; i++) {
                        body_top[i] = snake_body[i].getBoundingClientRect().top;
                        body_left[i] = snake_body[i].getBoundingClientRect().left;
                        body_right[i] = snake_body[i].getBoundingClientRect().right;
                        body_bottom[i] = snake_body[i].getBoundingClientRect().bottom;
                }
            }
        }
        
        if(snake_body.length !=0){
            snake_body[0].style.top = String(head_top) + 'px';
            snake_body[0].style.left = String(head_left) + 'px';
            for (let i = 0; i < snake_body.length; i++) {
                snake_body[i].style.top = String(body_top[i-1]) + 'px';
                snake_body[i].style.left = String(body_left[i-1]) + 'px';
                snake_body[i].innerHTML = i+1;
                snake_body[i].classList.add('vis')
            }
        }
    
        curr_head_top = snake_head.getBoundingClientRect().top;
        curr_head_left = snake_head.getBoundingClientRect().left;
        curr_head_bottom = snake_head.getBoundingClientRect().bottom;
        curr_head_right = snake_head.getBoundingClientRect().right;    
        for (let i = 0; i < snake_body.length; i++) {
            curr_body_top[i] = snake_body[i].getBoundingClientRect().top;
            curr_body_left[i] = snake_body[i].getBoundingClientRect().left;
        }

        
        for (let i = 2; i < snake_body.length; i++) {
            if(body_top[i]+24 <= curr_head_bottom
            && body_bottom[i]-24 >= curr_head_top
            && body_left[i]+24 <= curr_head_right
            && body_right[i]-24 >= curr_head_left){
                game_over();
            }
        }
        for (let i = 0; i < food.length; i++) {
            if(food_top[i] <= curr_head_bottom
            && food_bottom[i] >= curr_head_top
            && food_left[i] <= curr_head_right
            && food_right[i] >= curr_head_left){
                if(food_size[i] <= bite_power){
                    spawned[i] = false;
                    add_body();
                }
                else{
                    eat_larger_food(i);
                }
            }
        }
    }
    else{
        b_length.innerHTML = 0;
        bite.innerHTML = 0;
        for(let i = 0; i < food.length; i++){
            food[i].style.visibility = 'hidden';
        }
        snake_head.style.visibility = 'hidden';
        start_container.style.visibility = 'visible';
    }
    
}, 0);