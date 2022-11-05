$(document).ready(function(){
  $('.delete-catalog').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/catalogs/'+id,
      success: function(response){
        alert('Deleting Catalog');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    })
  });
});
