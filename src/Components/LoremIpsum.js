import React from 'react';

const LoremIpsum = () => {
  const paragraphs = [
    "Maecenas non sem eget dolor vehicula iaculis. Nam iaculis elit placerat sem mollis, a faucibus ipsum iaculis. Donec dapibus condimentum aliquet. Pellentesque aliquet turpis eros, vel imperdiet magna tempus eu. Curabitur ut tincidunt ipsum, ac scelerisque tellus. Nam vestibulum metus et tristique consectetur. Curabitur finibus mauris sed auctor tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin non metus augue.",
    "Etiam vitae sapien metus. Aenean egestas tortor id nisi porttitor, a semper odio viverra. In rutrum ipsum vitae ultricies aliquet. Suspendisse eu laoreet nisl. Praesent congue hendrerit dignissim. Morbi eget ipsum vitae nibh bibendum fringilla. Mauris dignissim mi faucibus bibendum volutpat. In congue, ante vel auctor scelerisque, dolor nisl feugiat arcu, ac vestibulum velit nibh eu sem. Sed sollicitudin, nisi vitae feugiat consequat, mi lacus suscipit arcu, quis faucibus sem massa vitae elit. Fusce porta ante non felis ornare, nec malesuada erat placerat. Ut orci eros, gravida at velit sed, scelerisque pulvinar tortor. Vestibulum eget egestas dui, vitae fermentum turpis.",
    "Donec vel leo bibendum, venenatis mi a, faucibus ex. Curabitur sollicitudin leo non interdum dapibus. In dapibus scelerisque auctor. Donec vitae eros in augue sodales aliquet. Vestibulum mollis nisi turpis, eu mollis eros pharetra tristique. Pellentesque ligula leo, consectetur in laoreet in, cursus tempor nisl. In id convallis augue. Aliquam vel accumsan diam, et sollicitudin nisi. Nulla semper cursus odio, fringilla tristique arcu. Morbi pretium ex et euismod molestie. Aenean aliquam augue quis lectus feugiat ultricies. Vivamus vulputate condimentum velit et accumsan. Maecenas hendrerit ultricies vehicula.",
    "Integer vulputate velit in augue porttitor, at ultrices lorem convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean quis nisi mauris. Proin placerat mi dignissim ex accumsan, non viverra sem ultrices. Pellentesque placerat libero eu fermentum tincidunt. Integer consequat sem ex, quis venenatis ex dictum sed. Nulla dictum nisl eu laoreet cursus. Morbi eget faucibus nibh. Cras faucibus velit sit amet eros vehicula consequat non quis urna.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed ultricies sem, id convallis tortor. Vivamus non odio est. Nam commodo dignissim diam, sed semper nisi commodo sed. In venenatis varius diam nec auctor. Cras purus mauris, faucibus non nisl non, accumsan porta nibh. Nam eget sollicitudin metus, in vehicula ipsum. Integer efficitur urna ut interdum fringilla. Vestibulum euismod risus et neque rutrum, ut scelerisque est venenatis. Donec porttitor augue nec nunc placerat, vitae scelerisque urna interdum. Maecenas bibendum eros quis sapien dignissim, sit amet pretium elit pharetra. Etiam blandit quam turpis."
  ];

  const getRandomParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
  };

  return (
    <p>{getRandomParagraph()}</p>
  );
};

export default LoremIpsum;