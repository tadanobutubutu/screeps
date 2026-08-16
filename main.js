const object = {
  prop: 'value',
  method: function() {
    console.log(this.prop + '.');
  }
};

object.method();