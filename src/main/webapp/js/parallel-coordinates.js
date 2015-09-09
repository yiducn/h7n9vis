/**
 * 
 */
  $(function() {
    var dimensions = new Filter();
    var highlighter = new Selector();

    dimensions.set({data: foods });

    var columns = _(foods[0]).keys();
    var axes = _(columns).without('name', 'group');

    var foodgroups =
      ["Dairy and Egg Products", /*"Spices and Herbs", "Baby Foods",*/ "Fats and Oils",
       "Poultry Products", "Soups, Sauces, and Gravies", "Vegetables and Vegetable Products",
       "Sausages and Luncheon Meats", "Breakfast Cereals", "Fruits and Fruit Juices",
       "Nut and Seed Products", "Beverages", "Finfish and Shellfish Products",
       "Legumes and Legume Products", "Baked Products", "Sweets", "Cereal Grains and Pasta",
       "Fast Foods", "Meals, Entrees, and Sidedishes", "Snacks", /*"Ethnic Foods",*/ "Restaurant Foods"];
    
    var colors = {
      "Dairy and Egg Products" : '#ff7f0e',
      "Spices and Herbs" : '#aec7e8',
      "Baby Foods" : '#555',
      "Fats and Oils" : '#ffbb78',
      "Poultry Products" : '#d62728',
      "Soups, Sauces, and Gravies" : '#98df8a',
      "Vegetables and Vegetable Products" : '#2ca02c',
      "Sausages and Luncheon Meats" : '#ff9896',
      "Breakfast Cereals" : '#9467bd',
      "Fruits and Fruit Juices" : '#c5b0d5',
      "Nut and Seed Products" : '#8c564b',
      "Beverages" : '#c49c94',
      "Finfish and Shellfish Products" : '#e377c2',
      "Legumes and Legume Products" : '#f7b6d2',
      "Baked Products" : '#7f7f7f',
      "Sweets" : '#c7c7c7',
      "Cereal Grains and Pasta" : ' #bcbd22',
      "Fast Foods" : '#dbdb8d',
      "Meals, Entrees, and Sidedishes" : '#17becf',
      "Snacks" : '#9edae5',
      "Ethnic Foods" : '#e7ba52',
      "Restaurant Foods" : '#1f77b4'
    }
    /*
    _(foodgroups).each(function(group) {
      $('#legend').append("<div class='item'><div class='color' style='background: " + colors[group] + "';></div><div class='key'>" + group + "</div></div>");
    });
*/
    var pc = parallel(dimensions, colors);
    // vertical full screen
    var parallel_height = 120;
    $('#parallel').css({
        height: parallel_height + 'px',
        width: $(window).width() + 'px'
    });

    pc.render();

    dimensions.bind('change:filtered', function() {
      var data = dimensions.get('data');
      var filtered = dimensions.get('filtered');
      var data_size = _(data).size();
      var filtered_size = _(filtered).size();
      //pie.update(filtered);
      //totals.update([filtered_size, data_size - filtered_size]);
      
      var opacity = _([2/Math.pow(filtered_size,0.37), 100]).min();
      //$('#line_opacity').val(opacity).change();
    });
    
    highlighter.bind('change:selected', function() {
      var highlighted = this.get('selected');
      pc.highlight(highlighted);
    });


    function addslashes( str ) {
      return (str+'')
        .replace(/\"/g, "\"\"")        // escape double quotes
        .replace(/\0/g, "\\0");        // replace nulls with 0
    };
  
  });
