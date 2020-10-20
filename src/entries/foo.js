import React from 'react';
import loadable from '@loadable/component';

import styles from './foo.module.scss'

const Foo = () => {

  const FooRouteA = loadable(function() {
    return import(/* webpackChunkName: "FooRouteA" */ '../routes/fooRouteA');
  }, {});

  const FooRouteB = loadable(function() {
    return import(/* webpackChunkName: "FooRouteB" */ '../routes/fooRouteB');
  }, {});

  return (
      <div className={styles.container}>
        <FooRouteA />
        <FooRouteB />
      </div>
  )
}

export default Foo;
