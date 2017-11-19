var app = {
    user_input : {
        start_date:$("#start_date"),
        investment : $("#investment"),
        goal: $("#goal"),
        target_sum: $("#target_sum"),
        roi_period: $("#roi_period"),
        options: $('input[name="goal-options"]:checked')
    },
    ui:{
        results_table: $("#results_table"),
        results_table_body: $("#results_table_body"),
        roi: $("#roi"),
        roii: $("#roii"),
        end_date:$("#end_date"),
        show_investment : $("#show_investment"),
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
        var p = parseFloat(app.user_input.investment.val());
        var days = app._get_days(parseInt(p));
        // var n=365;
        // var years = days / 365;
        // var roi = p* Math.pow((1 + 0.01 / n), n*(years));
        app.ui.end_date.html(`
            ${moment(app.data.start_date).format("MMM Do YYYY")} - 
            ${moment(app.data.start_date).add(days,'days').format("MMM Do YYYY")} (${days} days)`);
        
        var investment = p;
        var option = $('input[name="goal-options"]:checked').val();
        var a = [];
        a.push([
            moment(app.data.start_date),
            investment,
            0,
            0
        ])
        if (option == 1){
            app.ui.roi.html(`$${(p * ((days / 100))).toFixed(2)}`);
            app.ui.roii.html(`$${(p * (1 + (days / 100))).toFixed(2)}`);
            app.ui.show_investment.html(`$${p}`);   
            var wallet = 0;
            for (var i=1;i<days+1;i++){
                wallet += investment*0.01;
                a.push([
                    moment(app.data.start_date).add(i+1,'days'),
                    investment,
                    0,
                    wallet.toFixed(2)
                ])
            }
        }
        if (option == 2){
           var daily_target = parseInt(app.user_input.target_sum.val()) / parseInt(app.user_input.roi_period.data("val"));
            app.ui.show_investment.html(`$${p}`);   
            for (var i=1;i<days+1;i++){
                var prev_investment = parseFloat(a[i-1][1]);
                var day_roi = prev_investment * 0.01;
                if (daily_target > day_roi){
                    a.push([
                        moment(app.data.start_date).add(i+1,'days'),
                        parseFloat(prev_investment + day_roi).toFixed(2),
                        day_roi.toFixed(2),
                        day_roi.toFixed(2)
                    ]) 
                } else {
                    // a.push([
                    //     moment(app.data.start_date).add(i+1,'days'),
                    //     parseFloat(prev_investment).toFixed(2),
                    //     0,
                    //     day_roi.toFixed(2)
                    // ]) 
                    break;
                }
               
            }
            // app.ui.roi.html(`$${(p * (1 + (days / 100))).toFixed(2)}`);
            // app.ui.roii.html(`$${(p + p * (1 + (days / 100))).toFixed(2)}`);
        }

        output = "";
        for (var i=0; i<a.length; i++){
            output += `
            <tr>
            <td>${i}</td>
            <td class="mdl-data-table__cell--non-numeric">${moment(a[i][0]).format("MMM Do YYYY")}</td>
            <td>${a[i][1]}</td>
            <td>$${a[i][2]}</td>
            <td>$${a[i][3]}</td>
            </tr>
            `
        }
        
        app.ui.results_table_body.html(output);
        app.ui.results_table.show();
        app.ui.results_table[0].scrollIntoView();
        
    },
    show_selected_date: function(val){
        app.user_input.start_date.html(moment(val).format("MMM Do YYYY"));
    }
    
}


document.addEventListener("DOMContentLoaded", function(event) {
    // init date
    app.user_input.start_date.html(moment().format("MMM Do YYYY"));
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
    console.log("DOM fully loaded and parsed");
});


