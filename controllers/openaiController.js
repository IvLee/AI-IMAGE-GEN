const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
    const {prompt, size} = req.body;
    
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

    try {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize,
        });

        const imageUrl = response.data.data[0].url

        res.status(200).json({
            success: true,
            data: imageUrl
        });
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }

        res.status(400).json({
            success: false,
            error: 'Image could not be generated'
        });
    }
}


function generatePrompt(name, background, courseTopic, reason, target){
    
  return `Write a lesson welcome video script for ${target} about ${name} with a background in ${background} who is interested in ${courseTopic} because of ${reason} and the benefits of taking this course.
  Display as a welcome video script`;

}

const generateVideoScript = async (req, res) => {
    //const {name, background, courseTopic, reason} = req.body;
    
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(req.body.name,req.body.background,req.body.courseTopic,req.body.reason,req.body.target),
            max_tokens: 70,
            temperature: 0.6,
            top_p: 1,
            n: 1,
            stream: false,
            logprobs: null,
          });

          const videoScript = completion.data.choices[0].text;

          console.log(videoScript);

        res.status(200).json({
            success: true,
            data: videoScript
        });
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }

        res.status(400).json({
            success: false,
            error: 'Script could not be generated'
        });
    }
}

module.exports = {generateImage, generateVideoScript};