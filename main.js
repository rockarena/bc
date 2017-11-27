var app = {
    user_input : {
        start_date:$("#start_date"),
        investment : $("#investment"),
        goal: $("#goal"),
        target_sum: $("#target_sum"),
        roi_period: $("#roi_period"),
        reinvest_period: $("#reinvest_period"),
        options: $('input[name="goal-options"]:checked'),
        max_reinvesting_days: $('#max_reinvesting_days')
    },
    ui:{
        results_table: $("#results_table"),
        results_table_body: $("#results_table_body"),
        summary_table: $("#summary_table")
    },
    toggle_view:function(e){
        $('.details').toggle({duration:300,easing:'linear'});
        e.innerHTML = e.innerHTML == 'Show All' ? 'Filter Investments' : 'Show All'
    },
    get_interest:function(i){
        if (i<=1010)
            return 0.011
        if (i<=5010)
            return 0.012
        if (i<=10010)
            return 0.0125
    },
    data:{
        start_date: new Date()
    },
    _get_days: function(investment){
        try{
            investment = parseInt(investment)
            
            if (1009 >= investment && investment >=100){
                return 299
            }
            if (5009 >= investment && investment >=1010){
                return 239
            }
            if (10009 >= investment && investment >=5010){
                return 179
            }
            if (investment >= 10010 ){
                return 120
            }
        }
        catch (e) {
            //pass
        }
    },
    show_results: function(){
        $('.link-text').text('Filter Loans');
        var p = parseFloat(app.user_input.investment.val());
        var days = app._get_days(parseInt(p));
        var interest = 0.01;
        var goal_reached = '';
        var lending = 0;
        var common_summary = '';
        var lending_info = ''
        // var n=365;
        // var years = days / 365;
        // var roi = p* Math.pow((1 + interest / n), n*(years));
        var investment = p;
        var option = $('input[name="goal-options"]:checked').val();
        var a = [];
        a.push([
            moment(app.data.start_date),
            investment,
            0,
            0
        ]);
        var roi = `${(p * ((days / 100))).toFixed(2)}`;
        var roii = `${(p * (1 + (days / 100))).toFixed(2)}`;

        var summary_one = '';
        var summary_two = '';

    
        if (option == 1){
            var loans = 0;
            var wallet = 0;
            for (var i=1;i<days+1;i++){
                wallet += investment*interest;
                a.push([
                    moment(app.data.start_date).add(i+1,'days'),
                    investment,
                    0,
                    wallet.toFixed(2)
                ])
            }

            lending = a[a.length-1][1];
            roi = parseFloat(a[a.length-1][2]) > 0 ? 0 : a[a.length-1][3];
            roii = (parseFloat(roi) + p).toFixed(2);

            summary_one = `
                <tr>
                    <td>
                        <span class="mdl-data-table__cell--non-numeric">Profit:&nbsp;</span>
                    </td>
                    <td>
                        <span id="roi" class="left-text bold-font">$${roi}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="mdl-data-table__cell--non-numeric">Loan + Profit:</span>
                    </td>
                    <td>
                        <span id="roii" class="left-text bold-font">$${roii}
                        </span>
                    </td>
                </tr> `;   
        }
        // Todo: monthly bug fix
        if (option == 2){
            var target_reached = 0;
            var target_days = parseInt(app.user_input.roi_period.attr("data-val"))
            var target_sum = parseInt(app.user_input.target_sum.val())
            var daily_target = target_sum / target_days;
            var sum2 = 0;
            var loans = 0;
            var day_roi = 0;
            for (var i=1;target_sum>sum2;i++){
                var prev_investment = parseFloat(a[i-1][1]);
                day_roi = prev_investment * interest;
                if (target_sum >= prev_investment * interest * target_days ){
                    a.push([
                        moment(app.data.start_date).add(i+1,'days'),
                        parseFloat(prev_investment + day_roi).toFixed(2),
                        day_roi.toFixed(2),
                        day_roi.toFixed(2)
                    ]);
                    loans++;
                } else {
                    sum2 +=day_roi;
                    a.push([
                        moment(app.data.start_date).add(i+1,'days'),
                        parseFloat(prev_investment).toFixed(2),
                        0,
                        sum2.toFixed(2)
                    ]) 
                    target_reached = i
                    // break;
                }
               
            }
            
            lending = a[a.length-1][1];
            roi = parseFloat(a[a.length-1][2]) > 0 ? 0 : a[a.length-1][3];
            roii = (parseFloat(roi) + p).toFixed(2);
            

            
            if (target_reached){
                var summary_two = `
                <tr class="reinvest">   
                    <td colspan=2>
                        <div id="show_investment" class="center-text bold-font">
                        Daily lending for
                        ${target_reached} days
                        <br/> 
                        From ${moment(app.data.start_date).format("MMM Do YYYY")} To 
                        ${moment(app.data.start_date).add(target_reached,'days').format("MMM Do YYYY")}
                        <br/>
                        $${a[target_reached][1]} in Lendings
                        </div>
                    </td>
                </tr>`;
                let selected_period = parseInt(app.user_input.roi_period.attr("data-val"));
                goal_reached = `
                <tr>   
                    <td>
                       <span class="mdl-data-table__cell--non-numeric">Goal reached in : </span>
                    </td>
                    <td><span class="left-text bold-font">${target_reached} days (from starting date)</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="mdl-data-table__cell--non-numeric">First ${app.user_input.roi_period.val()} payment on :</span>        
                    </td>
                    <td>
                        <span class="left-text bold-font">
                            ${moment(app.data.start_date)
                            .add(target_reached,'days')
                            .format("MMM Do YYYY")}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="mdl-data-table__cell--non-numeric">First ${app.user_input.roi_period.val()} pay :</span>        
                    </td>
                    <td>
                        <span class="left-text bold-font">
                            $${a[target_reached][3]}
                        </span>
                        </td>
                </tr>`;
            }
            if (!target_reached){
                var summary_two = `
                <tr>       
                    <td colspan=2 class="red bgred">  
                    <div id="show_investment" class="left-text white center-text width-100 bold-font">  
                            Goal Not reached Try adjusting the periodical profit or the 1st loan.
                            </div>
                    </td>
                </tr>
                `

            }

            // app.ui.roi.html(`$${(p * (1 + (days / 100))).toFixed(2)}`);
            // app.ui.roii.html(`$${(p + p * (1 + (days / 100))).toFixed(2)}`);
        }

        if (option == 3){
            var target_reached = 0;
            var reinvesting_amount = parseInt(app.user_input.reinvest_period.attr("data-val"));
            var max_days = app.user_input.max_reinvesting_days.val() ? parseInt(app.user_input.max_reinvesting_days.val()) : -1;
            var sum = 0;
            var sum_roi = 0;
            var loans = 0;
            for (var i=1;i<days+1;i++){
                // var sum = parseFloat(a[i-1][3]);;
                var prev_investment = parseFloat(a[i-1][1]);
                var day_roi = prev_investment * interest;
                sum_roi += day_roi;
                sum += day_roi;
                if (max_days == 0){
                    a.push([
                        moment(app.data.start_date).add(i+1,'days'),
                        parseFloat(prev_investment).toFixed(2),
                        0,
                        sum_roi.toFixed(2)
                    ])
                }
                if ((reinvesting_amount !=0 && max_days ==-1) || max_days > 0){
                    if (sum>=reinvesting_amount){
                        a.push([
                            moment(app.data.start_date).add(i+1,'days'),
                            parseFloat(prev_investment + sum).toFixed(2),
                            sum.toFixed(2),
                            sum_roi.toFixed(2)
                        ]);
                        loans++;
                        sum = 0;
                        sum_roi = 0;
                        if (max_days!=-1)
                            max_days--;
                    } else {
                        a.push([
                            moment(app.data.start_date).add(i+1,'days'),
                            parseFloat(prev_investment).toFixed(2),
                            0,
                            sum_roi.toFixed(2)
                        ]);
                    }
                }
                if (reinvesting_amount == 0 && max_days == -1){
                    a.push([
                        moment(app.data.start_date).add(i+1,'days'),
                        parseFloat(prev_investment + day_roi).toFixed(2),
                        day_roi.toFixed(2),
                        day_roi.toFixed(2)
                    ])
                    loans ++;
                    // max_days--;
                }
                
            }
            
            lending = a[a.length-1][1];
            roi = parseFloat(a[a.length-1][2]) > 0 ? 0 : a[a.length-1][3];
            roii = (parseFloat(roi) + p).toFixed(2);

            summary_one = `
            <tr>
            <td>
                <span class="mdl-data-table__cell--non-numeric">Lending Period:&nbsp;</span>
            </td>
            <td> 
                <span id="end_date" class="left-text bold-font">
                ${days} days - 
                ${moment(app.data.start_date).format("MMM Do YYYY")} - 
                ${moment(app.data.start_date).add(days,'days').format("MMM Do YYYY")}
                </span>
            </td>
        </tr>
            <tr>
                <td>
                    <span class="mdl-data-table__cell--non-numeric">Profit :&nbsp;</span>
                </td>
                <td>
                    <span id="roi" class="left-text bold-font">$${roi}
                    </span>
                </td>
            </tr>
            `;  

        }
        
        if (option == 1){
        common_summary = `
            <tr>
                <td>
                    <span class="mdl-data-table__cell--non-numeric">Lending Period :&nbsp;</span>
                </td>
                <td> 
                    <span id="end_date" class="left-text bold-font">
                    ${days} days - 
                    ${moment(app.data.start_date).format("MMM Do YYYY")} - 
                    ${moment(app.data.start_date).add(days,'days').format("MMM Do YYYY")}
                    </span>
                </td>
            </tr>
            <tr>   
                <td>    
                    <span class="mdl-data-table__cell--non-numeric">Loan:&nbsp;</span>
                </td>
                <td>
                    <span id="show_investment" class="left-text bold-font">$${p}
                    </span>
                </td>
            </tr>`
        }
        if (loans && option==3){
            lending_info =`
            <tr>   
                <td>
                    <span class="mdl-data-table__cell--non-numeric">Total Lending :&nbsp;</span>
                </td>
                <td>
                    <div class="left-text bold-font">
                    $${lending}
                    </div>
                </td>
            <tr>
                <td>
                    <span class="mdl-data-table__cell--non-numeric">Active Loans :&nbsp;</span>
                </td>
                <td>
                    <div class="left-text bold-font">
                    ${loans}
                    </div>
                </td>
            </tr>`;
        }
        app.ui.summary_table.html(goal_reached + summary_two + common_summary + summary_one + lending_info);

        output = "";
        for (var i=0; i<a.length; i++){
            output += `
            <tr ${a[i][2] !=0 || i==0 ? 'class="reinvest"': "class='details'"}>
                <td>${i}</td>
                <td class="mdl-data-table__cell--non-numeric">${moment(a[i][0]).format("MMM Do YYYY")}</td>
                <td>$${a[i][1]}</td>
                <td>$${a[i][2]}</td>
                <td>$${a[i][3]}</td>
            </tr>
            `;
            if (a[i][2]!=0 || i==0){
                let loanRelease = i==0 ? (a[i][1] + ' First') : a[i][2];
                output +=`
                <tr class="reinvest">
                    <td colspan=5>
                        <div class="bold-font center-text">$${loanRelease} Loan, release date : 
                            ${moment(a[i][0]).add(app._get_days(a[i][2]!=0   ? a[i][2] : a[i][1]),'days').format("MMM Do YYYY")}
                        </div>
                    </td>
                </tr>
                `
            }
        }
    
        app.ui.results_table_body.html(output);
        app.ui.results_table.show();
        $('body').animate({scrollTop: app.ui.results_table.offset().top},'slow');
        // app.ui.results_table[0].scrollIntoView();
        
    },
    show_selected_date: function(val){
        app.user_input.start_date.html(moment(val).format("MMM Do YYYY"));
    }
    
}


document.addEventListener("DOMContentLoaded", function(event) {
    // init date
    app.user_input.start_date.html(moment().format("MMM Do YYYY") + ' (today)');
    var picker = new MaterialDatetimePicker()
    .on('submit', function(val){
        
        app.show_selected_date(val);
        app.data.start_date = val;
        // console.log(`data: ${val}`)
        // console.log()
    });
    // .on('open', () => console.log('opened'))
    // .on('close', () => console.log('closed'));
    
    var el = document.querySelector('.c-datepicker-btn')
    el.addEventListener('click', () => picker.open()); 
    console.log("wellcome :)");
});


