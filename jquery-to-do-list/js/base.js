;
(function() {
    var task_list = store.get('task_list') || [],
        $task_list = $('.task_list'),
        clock_list = [],
        index_displayed;
    //待插入的html模板
    var itemTemplate = function(tr_input, unique_id) {
        var str = '<div class="task_item ' + unique_id + '"><input type="checkbox" name="" id="item_id">' +
            '<label remind class="ti_input">' + tr_input + '</label>' +
            '<span class="task_delete">delete</span>' +
            '<span class="task_detail">detail</span>' +
            '</div>';
        return str;
    };
    //生成html, 并添加到文本底部
    var getHtmlAddToBttom = function(tr_input, unique_id) {
        var item_html = itemTemplate(tr_input, unique_id);
        $task_list.append(item_html);
    };
    //生成html, 并添加到文本顶部
    var getHtmlAddToTop = function(tr_input, unique_id) {
        var item_html = itemTemplate(tr_input, unique_id);
        $task_list.prepend(item_html);
    };
    //渲染checkbox
    var renderCheckbox = function(index) {
        $(".task_list input[type='checkbox']:eq("+index+")").prop('checked', task_list[index].done||false);
        if (task_list[index].done) {
             $('.task_item:eq(' + index + ')').addClass('done');
        }
        if (task_list[index].overdue) {
            $('.task_item:eq(' + index + ')').addClass('overdue');
        }
    };

    //添加到task_list头部 更新localstorage
    var storeTaskItemContent = function(tr_input, unique_id) {
        var task_item = {};
        task_item.content = tr_input;
        task_item.unique_id = unique_id;
        task_list.unshift(task_item);
        store.set('task_list', task_list);
    };
    //定时时间到时显示弹出框
    var outOfTime = function(description, unique_id) {
        var alarm_msg = $('<p class="alarm_msg"><span class="alarm_msg_describe">' + description + '定时时间到'+'</span><span class="alarm_msg_confirm '+unique_id+'">知道了<span/></p>');
        $('div.container').prepend(alarm_msg);
    };
    //添加一个定时任务
    var addTimer = function(unique_id, time) {
        console.log('启动定时器的信息:', unique_id, time);
        time = getTime_seconds(time);
        var timeNow = (new Date()).getTime(),
            selector = '.' + unique_id,
            clock_id = (function(unique_id) {
                console.log('修改前task_list:', task_list);
                return setTimeout(function() {
                        for (var i = 0; i < task_list.length; i++) {
                            if (task_list[i].unique_id === unique_id) {
                                break;
                            }
                        }
                    outOfTime(task_list[i].content, unique_id);
                    //添加移除事件
                    $(selector).on('click', function(){
                        $(this).parent().remove();
                        //对应的task_item 状态改为 done
                        console.log('延时判断已执行', i, unique_id);
                        task_list[i].done = true;
                        task_list[i].clock_on = false;
                        task_list[i].overdue = '';
                        //更新localStorage
                        console.log("修改后_task_list:", task_list);
                        store.set('task_list', task_list);
                        $task_list.find('.task_item:eq('+ i +')').addClass('done');
                        $task_list.find('.task_item:eq('+ i +') input').prop('checked', true);
                    });
                }, time - timeNow);
            })(unique_id);

        clock_list.push({ unique_id: unique_id, clock_id: clock_id });
    };
    //刷新时,全部定时提醒初始化
    var remindTaskList = function() {
        //确定当前时间
        var timeNow = (new Date()).getTime();
        //取得task_list_item中'done'属性为false的所有元素
        var detached, list_removed;
        for (var i = 0; i < task_list.length; i++) {
            if (!task_list[i].done && task_list[i].clock_on) {
                // 查看此时定时器是否过期
                if (timeNow <= getTime_seconds(task_list[i].clock)) {
                    //没有过期
                    addTimer(task_list[i].unique_id, task_list[i].clock);
                } else {
                    //已过期
                    //$('.task_list .task_item:eq('+i+')').addClass('done').addClass('overdue');
                    //$('.task_list .task_item:eq('+i+')').find('input[type="checkbox"]').prop('checked', true);
                    task_list[i].overdue = true;
                    task_list[i].done = true;
                    task_list[i].clock_on = false;
                    detached = $('.task_item:eq(' + i + ')').detach();
                    $task_list.append(detached);
                    list_removed = task_list.splice(i, 1)[0];
                    task_list.push(list_removed);
                    store.set('task_list', task_list);
                }
            }
        }
    };
    //判断是否已经绑定过定时器
    var hasbeenbound = function() {
        for (var i = 0; i < clock_list.length; i++) {
            if (task_list[index_displayed].unique_id === clock_list[i].unique_id) {
                return clock_list.splice(i, 1)[0].clock_id;
            } else {
                return false;
            }
        }
    };
    var readyToStarClock = function() {
        //输入框取得时间
        task_list[index_displayed].clock = $('.task_item_detail').find('#item_remind').val();
        //启动定时器
        addTimer(task_list[index_displayed].unique_id, task_list[index_displayed].clock);
        console.log('已启动');
        //更新localStorage
        task_list[index_displayed].clock_on = $('.task_item_detail').find('input#clock_on').prop('checked');
        store.set('task_list', task_list);
    };
    //删除一个task_list
    var deleteTask = function(index) {
        if (!task_list[index]) return;
        task_list.splice(index, 1);
    };
    //获得当前点击对象的index
    var getClickItemIndex = function(target) {
        var $task_items = $task_list.children();
        for (var i = 0; i < $task_items.length; i++) {
            if (target.parentNode === $task_items[i]) {
                break;
            }
        }
        return i;
    };
    //得到当前时间转化为2017/01/01 01:01格式
    var getDateNowToString = function() {
        var time = new Date(),
            year = time.getFullYear(),
            month = time.getMonth() + 1,
            date = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes();

        function zeroPrefix(item) {
            if (item < 10) {
                item = '0' + item;
            }
            return item;
        }
        month = zeroPrefix(month);
        date = zeroPrefix(date);
        hours = zeroPrefix(hours);
        minutes = zeroPrefix(minutes);
        return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes;
    };
    //日期字符串转换为时间毫秒值
    var getTime_seconds = function(string) {
        if (!string) return 0;
        var year = string.slice(0, 4),
            month = string.slice(5, 7) - 1,
            date = string.slice(8, 10),
            hours = string.slice(11, 13),
            minutes = string.slice(14, 16);
        var time = new Date(year, month, date, hours, minutes);
        return time.getTime();
    };
    //判断输入的日期是否正确
    var judgeTime = function(string) {
        var time_input = getTime_seconds(string),
            time_now = new Date();
        return time_input > time_now;
    };
    //渲染点击detail后的弹出框内容
    var renderPopContainer= function(index) {
        var $task_detail = $('.task_item_detail'),
            content = task_list[index].content || '',
            description = task_list[index].description || '',
            clock = task_list[index].clock || '';
        clock_on = task_list[index].clock_on || false;
        //done = task_list[index].done || false;
        $task_detail.find('input#item_title').val(content);
        $task_detail.find('textarea').val(description);
        $task_detail.find("input#item_remind")[0].value = clock;
        $task_detail.find('input#clock_on').prop('checked', clock_on);
    };
    //展示弹出窗口
    var displayTaskItemDetail = function(index) {
        renderPopContainer(index);
        $('.task_item_detail').removeClass('hidden');
        $('.mask').removeClass('hidden');
    };
    //隐藏弹出窗口
    var hideTaskItemDetail = function() {
        $('.task_item_detail').addClass('hidden');
        $('.mask').addClass('hidden');
    };
    //自定义判断弹窗
    var pop = function() {
        $('.mask').removeClass('hidden');
        $('.confirm_pop').removeClass('hidden');

        return new Promise(function(resolve, reject) {
            $('.confirm_pop').on('click', '.confirm_pop_true', function(event) {
                resolve(true);
            });
            $('.confirm_pop').on('click', '.confirm_pop_false', function(event) {
                reject(false);
            });
        });
    };
    //每次开始和刷新 根据localstorage初始化表单
    var init = function() {
        var item_html;
        var task_list = store.get('task_list');
        if (!task_list) return;
        remindTaskList();
            task_list = store.get('task_list');
        for (var i = 0; i < task_list.length; i++) {
            getHtmlAddToBttom(task_list[i].content, task_list[i].unique_id);
            renderCheckbox(i);
        }
    };

    init();

    $('#item_remind').datetimepicker();

    //点击submit添加输入框内容	
    $('#tr_submit').on('click', function(event) {
        event.preventDefault();
        var tr_input = $('#tr_input').val(),
            unique_id = 'num' + Math.random().toString().slice(2, 8);
        if (!tr_input) return;
        //将input值渲染为html 添加到 task_list 中

        getHtmlAddToTop(tr_input, unique_id);
        //localstorage存储添加的信息
        storeTaskItemContent(tr_input, unique_id);
        //click后清空input内容
        //$('#tr_input').val(');
    });

    //点击触发删除task_item功能
    $task_list.on('click', '.task_delete', function(event) {
        var index = getClickItemIndex(event.target);
        pop().then(function(value) {
            $task_list.children().eq(index).remove();
            deleteTask(index);
            store.set('task_list', task_list);
            $('.confirm_pop').unbind();
            $('.mask').addClass('hidden');
            $('.confirm_pop').addClass('hidden');
        }, function(value) {
            $('.confirm_pop').unbind();
            $('.mask').addClass('hidden');
            $('.confirm_pop').addClass('hidden');
        });
        //点击触发显示item详情
    }).on('click', '.task_detail', function(event) {
        //event.preventDefault();
        var index = getClickItemIndex(event.target);
        index_displayed = index;
        displayTaskItemDetail(index);
        //根据checkbox状态更新列表位置
    }).on('click', "input[type='checkbox']", function(event) {
        var index = getClickItemIndex(event.target),
            task_item_removed,
            task_list_removed;
        task_list[index].done = this.checked;
        if (this.checked) {
            $(this).parent().addClass('done');
            //将状态为checked的task_item移动到队列最后
            task_item_removed = $(this).parent().detach();
            $task_list.append(task_item_removed);
            //更新task_list状态
            task_list_removed = task_list.splice(index, 1)[0];
            task_list.push(task_list_removed);
        } else {
            $(this).parent().removeClass('done').removeClass('overdue');
            task_list[index].overdue = false;
            //将状态为checked的task_item移动到队列最前
            task_item_removed = $(this).parent().detach();
            $task_list.prepend(task_item_removed);
            //更新task_list状态
            task_list_removed = task_list.splice(index, 1)[0];
            task_list.unshift(task_list_removed);
        }
        //更新localstorage
        store.set('task_list', task_list);
    });
    //弹出窗口关闭
    $('.task_item_closed').on('click', function(event) {
        event.preventDefault();
        hideTaskItemDetail();
    });
    //提交时记录弹出窗口的信息, 更新localstorage
    $('.task_item_detail').on('click', 'button.confirm', function(event) {
        task_list[index_displayed].description = $('.describe > textarea').val();
        //纪录title 
        task_list[index_displayed].content = $('.task_item_detail>#item_title').val();
        //修改列表展示description
        $('.task_list').find('.task_item:eq('+index_displayed+')>label').html($('.task_item_detail>#item_title').val());
        console.log('done');
        if ($('#clock_on').is(':checked')) {
            task_list[index_displayed].clock = $('.remind > input')[0].value;
        }
        store.set('task_list', task_list);
        //监测定时功能是否被启用
    }).on('click', 'input#clock_on', function(event) {
        //只在选中时[checked = true]触发
        console.log("准备启动adTimer!!");
        if (this.checked) {
            //判断输入日期是否正确
            if (!judgeTime($('#item_remind').val())) {
                //输入日期错误
                $('#clock_on').prop('checked', false);
                return;
            } else {
                //更新task_list[index_displayed].clock_on的信息

                //判断是否已经绑定过定时器  task_list[index_displayed].unique_id 是否存在于 clock_list
                var clock_id = hasbeenbound();
                if (clock_id) {
                    //如果已经绑定过, 先解绑 再绑定计时器
                    clearTimeout(clock_id);
                    readyToStarClock();
                } else {
                    //没有绑定过则直接绑定计时器
                    readyToStarClock();
                }
                $('.task_item:eq(+"index_displayed"+)').removeClass('overdue');
            }
        }
    });
})();