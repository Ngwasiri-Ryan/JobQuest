// import React, { useEffect, useRef } from 'react';
// import { View, Animated, StyleSheet, Image } from 'react-native';
// import { icons } from '../../constants'; // Assuming you have your icons object set up

// const Loader = () => {
//   const bounceAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, [bounceAnim]);

//   const translateY = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -50], // Ball moves up by 50 units
//   });

//   const shadowScale = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 0.5], // Shadow shrinks when ball moves up
//   });

//   return (
//     <View style={styles.container}>
//       {/* Shadow */}
//       <Animated.View
//         style={[
//           styles.shadow,
//           { transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }] },
//         ]}
//       />
//       {/* Bouncing Image */}
//       <Animated.View style={[styles.bouncingPicture, { transform: [{ translateY }] }]}>
//         <Image source={icons.suitcase} style={styles.image} />
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bouncingPicture: {
//     width: 100,
//     height: 100,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   shadow: {
//    top:200,
//     width: 100,
//     height: 20,
//     backgroundColor: 'black',
//     borderRadius: 50,
//     opacity: 0.3,
//     bottom:10,
//      // Positioned below the bouncing image
//   },
// });

// export default Loader
//import React from 'react';
// import { SafeAreaView, StyleSheet, Text } from 'react-native';
// import { WebView } from 'react-native-webview';

// const Loader = () => {
//   const loaderHTML = `
//   <html>
//     <head>
//       <style>
//         .my-loader {
//           width: 300px; /* Increased size */
//           height: 300px; /* Increased size */
//           perspective: 1000px;
//           margin: 100px auto;
//         }

//         .rubiks-cube {
//           width: 100%;
//           height: 100%;
//           position: relative;
//           transform-style: preserve-3d;
//           animation: my-rotateCube 5s infinite linear;
//         }

//         .my-loader .face {
//           position: absolute;
//           display: flex;
//           flex-wrap: wrap;
//           width: 100%;
//           height: 100%;
//         }

//         .loading{
//            font-size:50px;
//            margin-top:200px;
//            text-align: center;
//            color:'black',
//            font-weight:'bold',
//         }
//         .my-loader .face.front {
//           transform: translateZ(150px); /* Increased Z translation */
//         }
//         .my-loader .face.back {
//           transform: rotateY(180deg) translateZ(150px); /* Increased Z translation */
//         }
//         .my-loader .face.left {
//           transform: rotateY(-90deg) translateZ(150px); /* Increased Z translation */
//         }
//         .my-loader .face.right {
//           transform: rotateY(90deg) translateZ(150px); /* Increased Z translation */
//         }
//         .my-loader .face.top {
//           transform: rotateX(90deg) translateZ(150px); /* Increased Z translation */
//         }
//         .my-loader .face.bottom {
//           transform: rotateX(-90deg) translateZ(150px); /* Increased Z translation */
//         }

//         .my-loader .cube {
//           width: calc(100% / 3);
//           height: calc(100% / 3);
//           box-sizing: border-box;
//           border: 1px solid #000;
//         }

//         @keyframes my-rotateCube {
//           0% {
//             transform: rotateX(0deg) rotateY(0deg);
//           }
//           100% {
//             transform: rotateX(360deg) rotateY(360deg);
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="my-loader">
//         <div class="rubiks-cube">
//           <div class="face front">
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//           </div>
//           <div class="face back">
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//           </div>
//           <div class="face left">
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//           </div>
//           <div class="face right">
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//           </div>
//           <div class="face top">
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//           </div>
//           <div class="face bottom">
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//             <div style="background: #ffeb3b;" class="cube"></div>
//             <div style="background: #4caf50;" class="cube"></div>
//             <div style="background: #2196f3;" class="cube"></div>
//             <div style="background: #ffffff;" class="cube"></div>
//             <div style="background: #ff3d00;" class="cube"></div>
//           </div>
//         </div>
//       </div>
//       <div class='loading'>Loading.....</div>
//     </body>
//   </html>
//   `;

//   return (
//     <SafeAreaView style={styles.container}>
//       <WebView originWhitelist={['*']} source={{ html: loaderHTML }} />
     
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: '70%',
//     backgroundColor: 'white',
//   },
// });

// export default Loader;

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Loader = () => {
  const loaderHTML = `
  <html>
    <head>
      <style>
        /* From Uiverse.io by zanina-yassine */
        #container {
          width: 100px; /* Increased size */
          height: 150px; /* Increased size */
          margin: auto auto;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .loading-title {
          display: block;
          text-align: center;
          font-size: 30px; /* Increased font size */
          font-family: 'Inter', sans-serif;
          font-weight: bold;
          padding-bottom: 20px;
          color: #888;
        }

        .loading-circle {
          display: block;
          border-left: 10px solid; /* Increased border size */
          border-top-left-radius: 100%;
          border-top: 10px solid; /* Increased border size */
          margin: 10px;
          animation-name: Loader_611;
          animation-duration: 1500ms;
          animation-timing-function: linear;
          animation-delay: 0s;
          animation-iteration-count: infinite;
          animation-direction: normal;
          animation-fill-mode: forwards;
        }

        .sp1 {
  border-left-color: #4A5BF4;
  border-top-color: #4A5BF4;
  width: 60px; /* Increased size */
  height: 60px; /* Increased size */
}

.sp2 {
  border-left-color: #0269FE;
  border-top-color: #0269FE;
  width: 50px; /* Increased size */
  height: 50px; /* Increased size */
}

.sp3 {
  width: 40px; /* Increased size */
  height: 40px; /* Increased size */
  border-left-color: #81D3E4;
  border-top-color: #81D3E4;
}


        @keyframes Loader_611 {
          0% {
            transform: rotate(0deg);
            transform-origin: right bottom;
          }

          25% {
            transform: rotate(90deg);
            transform-origin: right bottom;
          }

          50% {
            transform: rotate(180deg);
            transform-origin: right bottom;
          }

          75% {
            transform: rotate(270deg);
            transform-origin: right bottom;
          }

          100% {
            transform: rotate(360deg);
            transform-origin: right bottom;
          }
        }
      </style>
    </head>
    <body>
      <div id="container">
        <label class="loading-title">Loading ...</label>
        <span class="loading-circle sp1">
          <span class="loading-circle sp2">
            <span class="loading-circle sp3"></span>
          </span>
        </span>
      </div>
    </body>
  </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html: loaderHTML }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:'80%',
    backgroundColor: 'white',
  },
});

export default Loader;

