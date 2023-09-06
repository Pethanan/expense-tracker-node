const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const ForgotPasswordRequest = require("../models/forgotPasswordRequests");
const User = require("../models/user");

exports.postForgotPassword = async (req, res) => {
  try {
    const sender = { email: "peth.engr@gmail.com" };
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];

    apiKey.apiKey = process.env.SIB_API_KEY;

    const transEmailApi = new Sib.TransactionalEmailsApi();
    const mailId = req.body.mailId;
    const requestId = uuid.v4(); // creating uniqueID
    const receivers = [{ email: mailId }];

    let sendSMTPEmail = new Sib.SendSmtpEmail();
    sendSMTPEmail = {
      sender,
      to: receivers,
      headers: {
        "X-Mailin-custom":
          "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        "api- key": "xkeysib- xxxxxxxxxxxxxxxxx",
        "content-type": "application/json",
        accept: "application/json",
      },
      subject: "Reset the password for peth expense tracker",
      textContent: "Reset the password using below link",
      htmlContent: `<a href="http://localhost:4000/password/resetPassword/{{params.requestId}}">Click Here to Reset Password</a>`,
      params: { requestId: requestId },
    };

    const mailRes = await transEmailApi.sendTransacEmail(sendSMTPEmail);
    const user = await User.findOne({ where: { email: mailId } });
    console.log(user);
    console.log(user);
    console.log(user);

    const request = await ForgotPasswordRequest.create({
      id: requestId,
      isActive: true,
      userId: user.id,
    });
    console.log(mailRes);
    console.log(request);
  } catch (err) {
    console.log(err);
  }
};

exports.getResetPassword = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    console.log(req.params);
    const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(
      requestId
    );
    console.log(forgotPasswordRequest);
    if (forgotPasswordRequest && forgotPasswordRequest.isActive) {
      return res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form id="reset-form" action="/password/updatePassword/${requestId}" method="POST">
                                        <label for="newPassword">Enter New password</label>
                                        <input name="newPassword" type="password" required></input>
                                        <button type="submit">reset password</button>
                                    </form>
                                </html>`);
    } else if (!forgotPasswordRequest.isActive) {
      return res.status(400).json({
        success: false,
        message: "Password resetlink has expired",
        isRequestActive: false,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "something went wrong, try again resetting password",
        isRequestActive: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postUpdatePassword = async (req, res) => {
  try {
    const newPassword = document.querySelector();
    console.log(req.body);
    const resetPasswordId = req.params.requestId;
    console.log(req.params);
    console.log(req.params.requestId);
    console.log(resetPasswordId);
    console.log(newPassword);

    const resetPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id: resetPasswordId },
    });
    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });

    if (user) {
      //encrypting the password
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        bcrypt.hash(newPassword, salt, async function (err, hash) {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          await user.update({ password: hash });

          return res
            .status(201)
            .json({ message: "Successfuly updated the new password" });
        });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(500).json({ error, success: false });
  }
};
